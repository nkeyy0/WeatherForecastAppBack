export default {
  PORT: process.env.PORT || 5000,
  configFirebase: {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
  },
  jwtSecretKey: process.env.jwtSecretKey || 'text'
};
