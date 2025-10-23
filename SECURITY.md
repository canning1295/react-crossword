# Security Policy

## Supported Versions

This library is maintained on the `main` branch. Security fixes will typically be released as patch or minor versions against the latest published major version.

## Reporting a Vulnerability

If you believe you have found a security vulnerability, please:

- Do not open a public issue.
- Report it privately via GitHub Security Advisories: https://github.com/JaredReisinger/react-crossword/security/advisories/new
- Alternatively, you can email the maintainer listed in `package.json`.

Please include:

- A description of the issue and potential impact
- Steps to reproduce (a minimal example is ideal)
- Any relevant environment information (browser, OS, library versions)

You can expect an initial response within 7 days. We will coordinate a fix and disclosure timeline as appropriate.

## Security Best Practices for Consumers

This package renders only React elements and does not use `dangerouslySetInnerHTML`. To reduce risk when integrating:

- Treat any clue text and theme values derived from untrusted sources as untrusted input; do not pass raw HTML.
- Configure a Content Security Policy (CSP) in your host app. If you use server-side rendering, provide a nonce for styled-components.
- Keep dependencies up to date and run `npm audit` regularly.

## Scope

This project is a client-side UI component with no backend or network access. Persisted state uses `localStorage` only. Version 5.2.0 includes defensive parsing of stored data to avoid crashes when storage is corrupted.
