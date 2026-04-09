# SQSpeptides frontend

Copy environment variables from [`.env.template`](./.env.template) into `.env` or `.env.local`. Never commit real API keys.

## Crossmint (onramp / card checkout)

- Set `NEXT_PUBLIC_CROSSMINT_CLIENT_SIDE_API_KEY` and `CROSSMINT_SERVER_SIDE_API_KEY`.
- Set `NEXT_PUBLIC_CROSSMINT_ENV` to `production` for live cards (uses `https://www.crossmint.com` and mainnet USDC in `lib/crossmint/crossmint-api.ts`), or `staging` for sandbox.
- Optional: `NEXT_PUBLIC_CROSSMINT_PROJECT_ID` for your own reference (console project id).

Docs: [Client-side API keys](https://docs.crossmint.com/introduction/platform/api-keys/client-side) · [Production console](https://www.crossmint.com/console/overview) · [Staging console](https://staging.crossmint.com/console/overview)
