Dan John playlist transcript collector
=====================================

Requirements
------------

- Python 3.10 or newer
- Internet access to YouTube

Setup
-----

1. Extract all files from this archive into one directory.
2. Open a terminal in that directory.
3. Run: python -m pip install -r requirements.txt
4. Run: python download_playlist_transcripts.py "PLAYLIST_URL"

The collector writes transcript text files and a JSON download manifest. Keep
download_playlist_transcripts.py and extract_transcript.py together because the
playlist collector imports the single-video extraction module.
