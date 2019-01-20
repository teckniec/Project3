// webpack.config.js
new webpack.EnvironmentPlugin(['NODE_ENV', 'DEBUG']);
new Dotenv({
    path: './.env', // Path to .env file (this is the default)
    safe: true // load .env.example (defaults to "false" which does not use dotenv-safe)
  });
  