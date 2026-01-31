module.exports = {
  apps: [
    {
      name: 'price-checker-server',
      script: './dist/index.mjs',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      max_restarts: 50,
      min_uptime: 10000,
      restart_delay: 5000,
      exp_backoff_restart_delay: 1000,
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: false,
      log_date_format: false,
    },
  ],
};
