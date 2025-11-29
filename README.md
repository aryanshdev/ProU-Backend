# ProU Backend — Track 2: Backend

This repository creates a small Express.js backend server that implements RESTful APIs to manage Employees (CRUD) and uses Google OAuth for authentication. The APIs perform real database operations using pg-promise.


## Quick overview
- Server entry: `server.js`
- Routes:
	- Auth: `routes/auth.js` as `/auth` endpoint.
	- App (employee APIs): `routes/app.js` as `/app` endpoint (*protected*)
- DB connection helper: `database/dbConnection.js` (exports pg-promise db instance)

## Requirements
- Node.js 
- A PostgreSQL database available and reachable
- A Google OAuth 2.0 Client ID / Secret if using Google sign-in flow

## Environment variables
Create a `.env` file or set these in your environment:

- `PORT` (optional) — port to run the server (default 3000)
- `DB_URL` — PostgreSQL connection string for your PosgreSQL server (example: `postgres://user:pass@host:5432/dbname`)
- `GOOGLE_CLIENT_ID` — Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` — Google OAuth Client Secret
- `JWT_SECRET` — secret used to sign JWT tokens

The DB connection uses `pg-promise` and reads `process.env.DB_URL` in `database/dbConnection.js`.

## Install

1. Install dependencies:

```bash
npm i
```

2. Start the server:

```bash
node server.js
```

By default the server will listen on `PORT` or `3000`.

## Authentication / Google OAuth

- Start the OAuth flow by opening: GET /auth/google
- Google will redirect back to the callback URL configured in `server.js` (currently set to the Render URL). The callback handler signs a JWT and sets a cookie named `auth` and also redirects to the frontend with the token in the query string.
- The JWT payload signed in `routes/auth.js` looks like:

```json
{
	"id": "<google-id>",
	"name": "<displayName>",
	"email": "<email>",
	"pfp": "<profile-photo-url>"
}
```

- Protected routes expect the JWT to be sent in the `auth` header (not the cookie - hence preventing Cross-Site Cookie Sharing Issue I had in many projects before) as used by `ensureAuthenticated` middleware in `routes/auth.js` and applied in `server.js` to `/app`.

## API Reference

All `/app` endpoints are protected. Include the JWT token in the `auth` header.

Base: https://pro-u-frontend-theta.vercel.app

### 1) Create employee
- Method: POST
- Path: `/app/createEmp`
- Auth: required (`auth` header)
- Body (JSON):

```json
{
	"name": "Aryansh",
	"role": "Developer",
	"department": "Engineering",
	"status": "Present",
	"salary": 650000
}
```

- Success: 200 with JSON `{ "id": <newId> }`
- Errors: 500 on DB error

### 2) Read all employees
- Method: GET
- Path: `/app/allEmp`
- Auth: required
- Success: 200 with JSON array of employee objects (columns from DB)

### 3) Update employee details
- Method: PUT
- Path: `/app/updateDetails`
- Auth: required
- Body (JSON):

```json
{
	"id": 12,
	"name": "Aryansh",
	"role": "Software Developer",
	"dept": "Engineering",    
	"status": "Present",
	"salary": 750000
}
```

- Success: 200
- Errors: 500 on DB error

### 4) Mark present/absent
- Method: PUT
- Path: `/app/markPresentAbsent`
- Auth: required
- Body (JSON):

```json
{
	"id": 12,
	"status": "On Leave"
}
```

- Success: 200
- Errors: 500 on DB error

### 5) Delete employee
- Method: DELETE
- Path: `/app/rmEmp`
- Auth: required
- Body (JSON):

```json
{ "id": 12 }
```

- Success: 200
- Errors: 500 on DB error

### 6) Who am I (auth verify)
- Method: GET
- Path: `/auth/whoami`
- Auth: required
- Behavior: reads JWT from `auth` header and returns decoded payload. Used for ensuring user is valid or not after a long time.


## Database schema (recommended)

Run the SQL below to create a compatible `employees` table:

```sql
CREATE TABLE employees (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	role TEXT,
	department TEXT,
	status TEXT,
	salary NUMERIC
);
```
