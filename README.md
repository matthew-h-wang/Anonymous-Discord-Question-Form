# Anonymous-Discord-Question-Form
A simple form for submitting/editing/deleting anonymous questions to a Discord channel via webhook.

For development, the secret config variables are kept in a file called `.env`, which isn't on the repo. 
You can see `.sample-env` for the needed config variables; during deployment, those may be set via environment variables instead.

Install packages with `npm install`.

Run with `npm start`.

When testing, runs in `http://localhost:3000/`, or whatever the `PORT` environment variable is.
