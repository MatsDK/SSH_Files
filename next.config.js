module.exports = {
  env: {
    SSH_HOST: "192.168.0.214",
    SSH_USERNAME: "mats",
    SSH_SSH_PASSWORDHOST: "mats",
  },
  webpack: (config, options) => {
    config.node = {
      fs: "empty",
    };
    return config;
  },
};
