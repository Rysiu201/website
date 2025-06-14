# AetherRP Website

## Development

Install dependencies and run the development server with:

```bash
npm install
npm run dev
```

The application uses Discord OAuth to authenticate users. To send application forms to a Discord channel, set the `WEBHOOK_URL` environment variable in a `.env` file:

```env
WEBHOOK_URL=https://discord.com/api/webhooks/.../...
```

Start the production server with:

```bash
npm run build
npm start
```
