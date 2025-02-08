const config = {
  express: {
    port: 8000,
  },
  mongo: {
    host: 'mongodb://localhost',
    db: 'miloradowicz-hw-92',
  },
  saltWorkFactor: 10,
  rootPath: __dirname,
  publicPath: 'public',
};

export default config;
