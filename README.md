# Anonymous-Discord-Question-Form
A simple form for submitting/editing/deleting anonymous questions to a Discord channel via webhook.

For development, the config secrets are kept in a file called .env, which isn't on the repo. 
You can see .sample-env for what those are; during deployment, those may be set as environment variables instead.

Install packages with `npm install`
Run with `npm start`
When testing, runs in `http://localhost:3000/`, or whatever the `PORT` environment variable is.
