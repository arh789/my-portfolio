"""Reproduce the bounded SDA-3 source, generated-data and production checks.
Run from the repository root after npm run build.
  python3 docs/verification/sda3-2026-11-10/verify.py local
  python3 docs/verification/sda3-2026-11-10/verify.py live
No third-party Python dependencies are required.
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.request import Request, urlopen
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import hashlib
import json
import re
import subprocess
import sys

ROOT = Path.cwd()
OUT = ROOT / 'docs/verification/sda3-2026-11-10'
MANIFEST = json.loads((OUT / 'changes.json').read_text(encoding='utf-8'))
BASE = MANIFEST['base']
GENERATED = {'public/agent-map.json', 'public/agent-map.html', 'public/graph.json', 'public/sitemap.xml'}
EXECUTION_ONLY = {'.sda3-completion.py', '.sda3-record.py', '.github/workflows/sda3-completion.yml'}
ROUTES = [
 '/art/sda-3-analysing-embedding-space-structure-in-large-language-models',
 '/art/sda3-tldr',
 '/art/hidden-representations-without-hidden-layers',
 '/art/structural-extraction-protocol',
 '/art/project/sda3-structural-extraction',
 '/datamining-llm',
 '/art/youtube-video-index',
]

def run(*args):
    return subprocess.check_output(args, cwd=ROOT)

def digest(value):
    if isinstance(value, str): value = value.encode('utf-8')
    return hashlib.sha256(value).hexdigest()

def normalise(value):
    return ' '.join(value.split())

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.inside = 0
        self.skip = 0
        self.h1_open = False
        self.parts = []
        self.h1 = []
        self.links = []
        self.frames = []
        self.description = None
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'main': self.inside += 1
        if tag in ('script', 'style'): self.skip += 1
        if tag == 'h1': self.h1_open = True
        if tag == 'meta' and a.get('name') == 'description': self.description = a.get('content')
        if self.inside and not self.skip:
            if tag == 'a' and a.get('href'): self.links.append(a['href'])
            if tag == 'iframe' and a.get('src'): self.frames.append(a['src'])
            self.parts.append(' ')
    def handle_endtag(self, tag):
        if tag in ('script', 'style'): self.skip = max(0, self.skip - 1)
        if self.inside and not self.skip: self.parts.append(' ')
        if tag == 'main': self.inside = max(0, self.inside - 1)
        if tag == 'h1': self.h1_open = False
    def handle_data(self, data):
        if self.inside and not self.skip:
            self.parts.append(data)
            if self.h1_open: self.h1.append(data)
    def result(self):
        return {'text': normalise(''.join(self.parts)), 'h1': normalise(''.join(self.h1)),
                'description': self.description, 'links': self.links, 'frames': self.frames}

def page(raw):
    p = Page(); p.feed(raw); return p.result()

def strip_generated_time(data):
    data = json.loads(json.dumps(data))
    data.pop('generatedAt', None)
    return data

def local_checks():
    paths = sorted({c['path'] for c in MANIFEST['changes']})
    records = []
    for path in paths:
        old = run('git', 'show', BASE + ':' + path).decode('utf-8')
        expected = old
        for change in (c for c in MANIFEST['changes'] if c['path'] == path):
            assert expected.count(change['old']) == 1, (path, change['reason'])
            expected = expected.replace(change['old'], change['new'], 1)
        actual = (ROOT / path).read_bytes()
        assert actual == expected.encode('utf-8'), 'Unlisted edit: ' + path
        if path.endswith('.md'):
            old_links = re.findall(r'\]\(([^)]+)\)', old)
            new_links = re.findall(r'\]\(([^)]+)\)', expected)
            assert old_links == new_links, 'Link targets changed: ' + path
            assert re.findall(r'\{\{ youtube.*?\}\}', old) == re.findall(r'\{\{ youtube.*?\}\}', expected), path
            for field in ('title', 'slug', 'date'):
                assert re.findall(r'^' + field + r':.*$', old, re.M) == re.findall(r'^' + field + r':.*$', expected, re.M), (path, field)
            if '/art/posts/' in path: assert 'lastModified: "2026-11-10"' in expected, path
        records.append({'path': path, 'sha256': digest(actual), 'status': 'PASS'})
    changed = set(run('git', 'diff', '--name-only', BASE).decode().splitlines())
    untracked = set(run('git', 'ls-files', '--others', '--exclude-standard').decode().splitlines())
    for path in changed | untracked:
        assert path in paths or path in GENERATED or path in EXECUTION_ONLY or path == 'CURRENT_WORK.md' or path.startswith('docs/verification/sda3-2026-11-10/'), 'Unexpected path: ' + path
    original_work = run('git', 'show', BASE + ':CURRENT_WORK.md').decode()
    current_work = (ROOT / 'CURRENT_WORK.md').read_text()
    def original_plan(s): return s.split('## Original ten-task plan (verbatim)\n', 1)[1].split('\n## Progress tracking', 1)[0]
    assert original_plan(original_work) == original_plan(current_work), 'Original plan modified'
    method_paths = [p for p in paths if p.endswith('.md') and 'youtube-video-index' not in p]
    banned = ('necessity-bound', 'deterministic conditional inference', 'the shape of the internal decision process', 'locally necessary structure implied by the trace', 'minimum-cost explanation constraint', 'without observing multiple runs', '- observing multiple runs')
    for path in method_paths:
        text = (ROOT / path).read_text()
        for phrase in banned: assert phrase not in text, (path, phrase)
    # Full tracked-text audit, including incidental references and notebook source.
    audit = []
    relevant = re.compile(r'SDA.?3|necessity.bound|embedding.space|internal decision process|model introspection', re.I)
    for path in run('git', 'ls-files', 'src', 'scripts').decode().splitlines():
        try: text = (ROOT / path).read_text(encoding='utf-8')
        except (UnicodeDecodeError, IsADirectoryError): continue
        if path.endswith('.ipynb'):
            doc = json.loads(text)
            text = '\n'.join(''.join(cell.get('source', [])) for cell in doc.get('cells', []))
        matches = [(n, line) for n, line in enumerate(text.splitlines(), 1) if relevant.search(line)]
        if matches: audit.append({'path': path, 'matches': [{'line': n, 'text': t} for n, t in matches]})
    (OUT / 'audit.json').write_text(json.dumps(audit, ensure_ascii=False, indent=2) + '\n')
    old_map = json.loads(run('git', 'show', BASE + ':public/agent-map.json'))
    new_map = json.loads((ROOT / 'public/agent-map.json').read_text())
    old_graph = json.loads(run('git', 'show', BASE + ':public/graph.json'))
    new_graph = json.loads((ROOT / 'public/graph.json').read_text())
    assert old_map['counts'] == new_map['counts']
    assert [n['id'] for n in old_map['siteGraph']['nodes']] == [n['id'] for n in new_map['siteGraph']['nodes']]
    assert old_map['siteGraph']['edges'] == new_map['siteGraph']['edges']
    assert [a['slug'] for a in old_graph['articles']] == [a['slug'] for a in new_graph['articles']]
    for before, after in zip(old_graph['articles'], new_graph['articles']):
        for key in ('slug', 'title', 'date', 'tags', 'projects', 'medium'):
            assert before.get(key) == after.get(key), (before['slug'], key)
    assert [p['slug'] for p in old_graph['projects']] == [p['slug'] for p in new_graph['projects']]
    for before, after in zip(old_graph['projects'], new_graph['projects']):
        for group in ('chapters', 'resources'):
            assert [a['slug'] for a in before.get(group, [])] == [a['slug'] for a in after.get(group, [])], (before['slug'], group)
    old_sitemap = run('git', 'show', BASE + ':public/sitemap.xml').decode()
    new_sitemap = (ROOT / 'public/sitemap.xml').read_text()
    assert re.findall(r'<loc>(.*?)</loc>', old_sitemap) == re.findall(r'<loc>(.*?)</loc>', new_sitemap)
    for route in ROUTES:
        raw = (ROOT / '.next/server/app' / (route.lstrip('/') + '.html')).read_text()
        assert page(raw)['text'], route
    result = {'checkedAt': datetime.now(timezone.utc).isoformat(), 'base': BASE, 'status': 'PASS',
              'sourceFiles': records, 'guardedReplacements': len(MANIFEST['changes']),
              'auditFiles': len(audit), 'counts': new_map['counts'],
              'originalPlanPreserved': True, 'routesAndMembershipPreserved': True,
              'generatedFiles': [{'path': p, 'sha256': digest((ROOT / p).read_bytes())} for p in sorted(GENERATED)]}
    (OUT / 'local.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({'status': 'PASS', 'sourceFiles': len(records), 'replacements': len(MANIFEST['changes']), 'auditFiles': len(audit), 'counts': new_map['counts']}))

def live_checks():
    base_url = sys.argv[2].rstrip('/') if len(sys.argv) > 2 else 'https://decrepitfilth.art'
    paths = ROUTES + ['/agent-map.json', '/agent-map.html', '/graph.json', '/sitemap.xml']
    def fetch(route):
        request = Request(base_url + route, headers={'Cache-Control': 'no-cache', 'User-Agent': 'SDA3-publication-verification/1.0'})
        with urlopen(request, timeout=40) as response:
            assert response.status == 200, (route, response.status)
            return route, response.read().decode('utf-8')
    result = []
    for route, actual in ThreadPoolExecutor(max_workers=4).map(fetch, paths):
        if route in ROUTES:
            expected = (ROOT / '.next/server/app' / (route.lstrip('/') + '.html')).read_text()
            a, e = page(actual), page(expected)
            assert a == e, (route, [k for k in a if a[k] != e[k]])
            result.append({'route': route, 'httpStatus': 200, 'status': 'PASS', 'mainTextSha256': digest(a['text']), 'title': a['h1'], 'metadataLinksAndVideosMatch': True})
        elif route.endswith('.json'):
            a = strip_generated_time(json.loads(actual))
            e = strip_generated_time(json.loads((ROOT / 'public' / route.lstrip('/')).read_text()))
            assert a == e, route
            result.append({'route': route, 'httpStatus': 200, 'status': 'PASS', 'comparison': 'Full JSON, excluding generatedAt only'})
        elif route.endswith('.html'):
            def remove_timestamp(text): return re.sub(r'20\d{2}-\d{2}-\d{2}T[0-9:.]+Z', '<generatedAt>', text)
            expected = (ROOT / 'public' / route.lstrip('/')).read_text()
            assert remove_timestamp(actual) == remove_timestamp(expected), route
            result.append({'route': route, 'httpStatus': 200, 'status': 'PASS', 'comparison': 'Full HTML, excluding generation timestamp only'})
        else:
            assert actual == (ROOT / 'public' / route.lstrip('/')).read_text(), route
            result.append({'route': route, 'httpStatus': 200, 'status': 'PASS', 'comparison': 'Exact XML'})
        print(route, 'PASS', flush=True)
    output = {'checkedAt': datetime.now(timezone.utc).isoformat(), 'baseUrl': base_url, 'status': 'PASS', 'pages': result}
    (OUT / 'live.json').write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n')

if __name__ == '__main__':
    if len(sys.argv) < 2 or sys.argv[1] not in ('local', 'live'):
        raise SystemExit('Usage: verify.py local | live [base-url]')
    local_checks() if sys.argv[1] == 'local' else live_checks()
