// logUtils.js
const log = {
  debug: (message) => {
    if (__DEV__) {
      console.log(`[DEBUG]: ${message}`);
    }
  },
  error: (message) => {
    console.error(`[ERROR]: ${message}`);
  },
};

export default log;
