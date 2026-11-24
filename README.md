<div align="center">

# Fly The Nest API

**The server behind Fly The Nest: batches, lectures, attendance, fees and recordings.**

[Futile Studio](https://futile.studio)

![Express](https://img.shields.io/badge/Express-4-0b0b0b?style=flat-square&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pg-0b0b0b?style=flat-square&logo=postgresql)
![Last commit](https://img.shields.io/github/last-commit/MayurJivani/FTN-backend?style=flat-square&labelColor=0b0b0b&color=c6ff00)

</div>

> **Fly The Nest** · backend API · last commit Sep 2026

## Overview

This is the Express API that runs Fly The Nest. It keeps its data in Postgres, uses JWT for logins and stores uploads and recordings in S3.

The web and mobile clients live in separate repos. This repo only holds the server.

Every route sits under `/ftn_api`. Logins use bcrypt for passwords and return a JWT that lasts one day.

## Features

- **Users** (`/users`): register, bulk register, login, OTP resend, forgot and update password, profile, verify users.
- **Admin** (`/admin`): admin login.
- **Mentors** (`/mentor`): add a mentor with a file upload, mentor login, list mentors.
- **Batches** (`/batch`): list batches.
- **Lectures** (`/lecture`): schedule a lecture, list lectures, today's lectures.
- **Attendance** (`/attendance`): list attendance.
- **Leave** (`/leave`): apply for leave, list leave by batch, approve or deny.
- **Feedback** (`/feedback`): save and list feedback.
- **Payments** (`/payment`): payment schedules, add payments, list schedules per user.
- **Recorded lectures** (`/recording`): list recordings, list them per batch, add a recording, get a CloudFront URL for a recording (returned base64 encoded).
- **Files** (`/files`): upload files per session to S3, list them, download them.
- **Zoom** (`/zoom`, `/meeting`): Zoom OAuth, Zoom Video SDK session tokens, fetch and upload recordings, and a webhook endpoint.

Every request is rate limited to 100 per 15 minutes per IP. Helmet sets the security headers. CORS allows any origin.

## Stack

- Node.js with Express 4
- Postgres through `pg`
- JWT (`jsonwebtoken`) and bcrypt for auth
- AWS S3 through the AWS SDK v3, with CloudFront for playback
- Multer for uploads, Nodemailer for email
- Winston and Morgan for logs

## Running it locally

There is no `.env.example` in the repo yet, so create `.env` yourself using the names in [Configuration](#configuration).

```bash
npm install
npm start      # node index.js
npm run dev    # nodemon
```

The server listens on `SERVER_PORT`, which defaults to 5000.

`npm test` runs mocha, but the repo has no test files yet.

The repo has no schema or migration files. You need the Postgres tables in place before the routes do anything useful. Which tables are needed is not documented here.

## Configuration

| Variable | Purpose |
| --- | --- |
| `SERVER_PORT` | Port to listen on (default 5000) |
| `LOG_LEVEL` | Winston log level (default `info`) |
| `NODE_ENV` | Set to `production` to turn off console logs |
| `DB_USER`, `DB_HOST`, `DB_DATABASE`, `DB_PASSWORD`, `DB_PORT` | Postgres connection |
| `JWT_SECRET` | Signs and checks login tokens |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` | S3 access (the upload region is set in `src/models/awsBucket.js`) |
| `CLOUDFRONT_DOMAIN` | Base URL for recording playback links |
| `MAIL_HOST`, `MAIL_USER`, `MAIL_PASS` | SMTP login for outgoing mail (port 587) |
| `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET`, `ZOOM_REDIRECT_URI` | Zoom OAuth |
| `ZOOM_SDK_KEY`, `ZOOM_SDK_SECRET` | Zoom session token signing |
| `VIDEO_SDK_API_KEY`, `VIDEO_SDK_API_SECRET` | Video SDK API credentials |
| `VIDEO_SDK_EVENT_SECRET` | HMAC key for the Zoom webhook URL check |

Logs go to `error.log` and `combined.log` in the folder you start the server from.

## Project structure

```
index.js           app setup, middleware, port
src/routes/        one file per feature, mounted under /ftn_api
src/controllers/   request handlers
src/models/        database queries and S3 helpers
src/middleware/    auth, CORS, file uploads
src/config/        env config, Postgres pool, mail config
src/utils/         logger, email sending
src/templates/     payment confirmation email
src/docs/          course slides (Day 1 to 4)
src/documents/     course notes (Excel, SQL, Python, Power BI)
```

## Licence

No licence file yet, all rights reserved.

---

<p align="center"><sub>Built by <a href="https://github.com/MayurJivani">Mayur Jivani</a> at <a href="https://futile.studio">Futile Studio</a>. Everything is futile. Do it anyway.</sub></p>
