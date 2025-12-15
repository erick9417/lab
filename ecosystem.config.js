module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'server/src/index.js',
      instances: 1,
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'frontend',
      script: 'npx',
      args: 'http-server lucvan-sistema/dist -p 3000',
      instances: 1,
      cwd: '/home/lucvan5/lucvan-sistema'  // Adjust path if needed
    }
  ]
};