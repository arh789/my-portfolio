'use client';

import React from 'react';
import { useForm, ValidationError } from '@formspree/react';

export default function ContactPage() {
  const [state, handleSubmit] = useForm("mvzvgkye");

  if (state.succeeded) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <div
          style={{
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(12px)',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            textAlign: 'center'
          }}
        >
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            Thank you
          </h1>
          <p>Your message has been sent.</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ position: 'relative', minHeight: '100vh' }}>

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '700px',
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(12px)',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff'
          }}
        >
          <h1
            style={{
              fontSize: '2rem',
              marginBottom: '1.5rem',
              color: '#e6c84f'
            }}
          >
            Contact
          </h1>

          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Your email"
              required
              style={{
                padding: '14px',
                fontSize: '1.1rem',
                background: '#111',
                color: '#fff',
                border: '1px solid #333',
                borderRadius: '6px'
              }}
            />

            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
            />

            <textarea
              id="message"
              name="message"
              placeholder="Message"
              required
              rows={6}
              style={{
                padding: '14px',
                fontSize: '1.1rem',
                background: '#111',
                color: '#fff',
                border: '1px solid #333',
                borderRadius: '6px'
              }}
            />

            <ValidationError
              prefix="Message"
              field="message"
              errors={state.errors}
            />

            <input
              type="hidden"
              name="_subject"
              value="New message from portfolio"
            />

            <button
              type="submit"
              disabled={state.submitting}
              style={{
                padding: '14px',
                fontSize: '1.1rem',
                cursor: 'pointer',
                background: '#e6c84f',
                border: 'none',
                fontWeight: 'bold',
                borderRadius: '6px'
              }}
            >
              {state.submitting ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}