export default {
  PORT: process.env.PORT || 5000,
  configFirebase: {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    storageBucket: process.env.storageBucket,
  },
  jwtSecretKey: process.env.jwtSecretKey || 'text'
};
