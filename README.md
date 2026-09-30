# Fly The Nest API

![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)
![Postgres](https://img.shields.io/badge/Postgres-pg-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS-S3%20uploads-FF9900?style=flat-square&logo=amazonwebservices&logoColor=white)
[![Last commit](https://img.shields.io/github/last-commit/MayurJivani/FTN-backend?style=flat-square)](https://github.com/MayurJivani/FTN-backend/commits/main)

The API behind Fly The Nest. Express on Postgres, with JWT auth, bcrypt
password hashing, S3-backed media uploads via multer, transactional mail
through Nodemailer, and Helmet, CORS and per-IP rate limiting in front of all
of it. Requests are logged with morgan and winston.

Clients: [web](https://github.com/MayurJivani/frontend) and
[mobile](https://github.com/MayurJivani/ftn-application).

```bash
npm install
cp .env.example .env    # database URL, JWT secret, AWS and SMTP credentials
npm run dev             # nodemon
npm start
npm test                # mocha
```
