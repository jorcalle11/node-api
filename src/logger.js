module.exports = function logger(namespace) {
  function log(message, ...args) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}][${namespace}] ${message}`, ...args);
  }

  function error(message, ...args) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}][${namespace}][ERROR] ${message}`, ...args);
  }

  function warn(message, ...args) {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}][${namespace}][WARN] ${message}`, ...args);
  }

  function info(message, ...args) {
    const timestamp = new Date().toISOString();
    console.info(`[${timestamp}][${namespace}][INFO] ${message}`, ...args);
  }

  return { log, error, warn, info };
};
