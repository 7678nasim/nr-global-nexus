# NR Global Nexus — Admin & Operations Upgrade

This package contains the source changes made after a deep review of the uploaded project.

## Implemented

1. Premium Admin Command Center remains at `/admin`.
2. Admin now includes:
   - Overview dashboard
   - Leads inbox with status pipeline: New / Contacted / Qualified / Closed
   - Careers inbox with resume download and candidate stages
   - Newsletter subscriber inbox + CSV export
   - NexusAI conversation inbox + full conversation view
   - Blog CMS with draft-safe admin access
3. Security hardening:
   - Lead listing is admin-only
   - Career application listing is admin-only
   - Chat history is admin-only
   - Blog create/update/delete is admin-only
   - Unpublished blog posts are not publicly readable
4. Optional free SMTP notifications are supported for:
   - New lead
   - New career application
   - New newsletter subscriber
   - Callback request
   - AI-captured chatbot lead
5. SEO React Hook dependency warning fixed.
6. Production frontend build completed successfully.

## Environment

Keep your existing local `backend/.env` and `frontend/.env` files; they are intentionally not included in this sanitized package.

For optional email notifications, add these to the BACKEND environment (Render Environment Variables or local `backend/.env`):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-company-gmail@gmail.com
SMTP_PASSWORD=your-16-character-gmail-app-password
NOTIFY_FROM=your-company-gmail@gmail.com
NOTIFY_TO=info@nrglobalnexus.com,hr@nrglobalnexus.com,sales@nrglobalnexus.com
```

Do not use your normal Gmail password. Use a Gmail App Password on an account where 2-Step Verification is enabled.

## Local verification

Frontend:

```powershell
cd "C:\Users\LENOVO\NR GLOBAL NEXUS\frontend"
npm start
```

Production build:

```powershell
npm run build
```

Backend is the existing FastAPI service in `backend/server.py`.

## Deployment order

1. Replace the corresponding source files with this package's files.
2. Keep your existing `.env` files/secrets.
3. Run `npm run build` in `frontend`.
4. Commit the source changes.
5. Push to `main` so the connected Render services deploy.
6. Open `/admin` and sign in with the password stored in backend `ADMIN_PASSWORD`.
7. Verify Leads, Careers, Newsletter and NexusAI Inbox.
8. Add SMTP environment variables only when you want email notifications.
