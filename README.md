# Clinic Management System

A naive and basic implementation of CMS. The goal of building this app to get a better understanding of technical part of building end to end features, architecture planning and deployment.

## How to run locally

1. Make sure to clone this repository first.

2. Make sure to include `.env` file. You only need `DATABASE_URL` to run this app.

```bash
DATABASE_URL=''
```

3. Make sure to have `NodeJS` version `21`, `pnpm` and `postgresql` version `18` or above installed in your local machine.

4. Open up a terminal and run this command

```bash
// MUST: to seed some data into database.
pnpm seed

pnpm install
pnpm dev --open
```

5. Finally, it should open a `localhost:3000` app inside your default browser.

## Deployment

### Production (Still in Planning Phase)

1. [Netlify](https://www.netlify.com/) to host full stack application. **(PENDING)**
2. [AppWrite](https://appwrite.io/) to host postgres database. **(PENDING)**
