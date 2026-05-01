# NotepadAnon Mail Prototype

This folder is fully separate from the main application and is intended for concept validation only.

## What this prototype demonstrates

- Account identity generation with random ID format (`npa_...`)
- 12-word recovery phrase generation and phrase-based unlock
- Paid account-to-account messaging model (Basic, Gold, Enterprise)
- Mock billing selection for Stripe or Bitcoin
- Owner-signed billing admin for lifetime gifts (`billing-admin.html`)
- Prototype gift endpoints: `/api/billing/gift`, `/api/billing/gift/revoke`, `/api/billing/gift/search`
- Attachment validation with strict 10MB cap per file
- Supported attachment families: docs, code files, images, and videos
- Inbox rendering for messages addressed to the active account
- Email-style inbox layout with message list + reading pane
- Delete selected message from inbox
- Tools workspace (Gold + Enterprise only): Word editor, Excel editor, Calendar, Notes

## What is intentionally mocked

- Real encryption and key exchange
- Real Stripe subscription lifecycle and webhooks
- Real Bitcoin invoicing and settlement
- Server-side persistence and object storage
- Anti-malware scanning and abuse mitigation

## How to run

1. Open `mission.html` in a browser.
2. Use the page navigation:
  - `identity.html` to generate and unlock identities
  - `billing.html` to activate paid plan
  - `billing-admin.html` to sign owner session and manage lifetime gift entitlements
  - `compose.html` to send text and optional attachments
  - `inbox.html` to view delivered messages
  - `tools.html` for Gold/Enterprise tools workspace
3. Create at least two identities so one can send to the other.
4. Unlock one account and activate paid plan.
5. Send a message to the second account ID.
6. Unlock the recipient account and refresh inbox.

## Notes

- State is stored in browser local storage.
- This is a product and UX prototype only, not production code.
