// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "aetherrp",
      script: "bash",
      args: "-c 'npm run build && node server.js'",
      env: {
        NODE_ENV: "production",
        PORT: 8080,
      },
    },
  ],
};
