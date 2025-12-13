module.exports = {
  apps: [
    {
      name: "play-store",
      script: "npm",
      args: "start",
      cwd: "/var/www/play-store",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      error_file: "/var/log/play-store/error.log",
      out_file: "/var/log/play-store/out.log",
      merge_logs: true,
    },
  ],
};
