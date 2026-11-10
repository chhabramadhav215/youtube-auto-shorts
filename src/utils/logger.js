export const logger = {
  info: (msg, ...args) => {
    console.log(`\x1b[36m[${new Date().toLocaleTimeString()}] ℹ INFO:\x1b[0m ${msg}`, ...args);
  },
  success: (msg, ...args) => {
    console.log(`\x1b[32m[${new Date().toLocaleTimeString()}] ✔ SUCCESS:\x1b[0m ${msg}`, ...args);
  },
  warn: (msg, ...args) => {
    console.warn(`\x1b[33m[${new Date().toLocaleTimeString()}] ⚠ WARN:\x1b[0m ${msg}`, ...args);
  },
  error: (msg, ...args) => {
    console.error(`\x1b[31m[${new Date().toLocaleTimeString()}] ✖ ERROR:\x1b[0m ${msg}`, ...args);
  },
  slot: (slotName, msg) => {
    console.log(`\x1b[35m[${new Date().toLocaleTimeString()}] 🎬 [${slotName.toUpperCase()}]:\x1b[0m ${msg}`);
  }
};
