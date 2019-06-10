# Trello scope tracker

## Description

This app, deployed with serverless, intercepts webhooks from trello. It filters the webhooks to those that correspond to moving a trello card to a list with a given modelId. Depending on the webhook, a request to a specific Zap in Zapier is sent.

## Useful serverless commands

Deploy the app: `sls deploy [--stage production]`

If the `--stage` option is not used, the default stage is `dev`

Above command will require recreating any webhooks pointing to this app, since the URL will change

Update a function of the app without redeploying: `sls deploy -f scopeTracker`

Above command does NOT require recreating any webhooks, since the URL will remain the same.

Use `serverless invoke -f myFunction -l` to test your AWS Lambda Functions on AWS

Remove the app: `sls remove`

See URLs of deployed apps for a given AWS profile (e.g. serverless-admin): `sls deploy --profile serverless-agent`

See app logs: `sls logs -f scopeTracker -t`

[Serverless commands cheatsheet](https://serverless.com/framework/docs/providers/aws/guide/workflow#cheat-sheet)

## Setup for local development

1. Run the app in debug mode (F5 in VSC)
2. Expose a public URL using ngrok (`./ngrok http 3000`)
3. [Create a trello webhook](https://developers.trello.com/reference#webhooks-2) with the public URL

## Other utils

[AWS credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/)

Switch AWS user profile: `export AWS_PROFILE="serverless-agent"`
