VERCEL ENVIRONMENT VARIABLE SETUP GUIDE
======================================

Your app is failing because DATABASE_URL is not set on Vercel.

IMMEDIATE FIX REQUIRED:
1. Go to https://vercel.com/dashboard
2. Click on your project: "thread-hub-community-feed"
3. Go to Settings → Environment Variables
4. Add the following variables:

   Name: DATABASE_URL
   Value: postgresql://[user]:[password]@[hostname]/[database]
   (Get this from your Neon console at https://console.neon.tech/)
   
   Name: SECRET_KEY
   Value: django-insecure-your-long-random-string-here
   
   Name: DEBUG
   Value: False
   
   Name: ALLOWED_HOSTS
   Value: localhost,127.0.0.1,thread-hub-community-feed.vercel.app
   
   Name: CORS_ALLOWED_ORIGINS
   Value: http://localhost:3000,https://thread-hub-community-feed.vercel.app

5. After adding all variables, redeploy:
   - Go to Deployments
   - Click the ⋮ menu on the latest deployment
   - Select "Redeploy"

FINDING YOUR DATABASE_URL FROM NEON:
====================================
1. Go to https://console.neon.tech/
2. Click on your project
3. Click on your database
4. Go to "Connection string" section
5. Copy the PostgreSQL connection string (starts with "postgresql://")
6. Paste it as DATABASE_URL in Vercel

Example format:
postgresql://user:password@ep-example.neon.tech/dbname

Do NOT include the query parameters (?sslmode=require) - Vercel/Django handle SSL automatically.
