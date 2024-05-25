const fs = require('fs');

let logBuffer = ''; 

function logger(req, res, next) {
  const logMessage = `[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.url}\n`;
  logBuffer += logMessage;

  if (logBuffer.length >= process.env.MAX_BUFFER_SIZE) {
    flushLogsToFile();
  }
  next();
}

function flushLogsToFile() {
  fs.appendFile(process.env.LOG_FILE_PATH, logBuffer, (err) => {
    if (err) {
      console.error('Error writing logs to file:', err);
    } else {
      console.log('Logs flushed to file');
    }
  });

  logBuffer = '';
}


module.exports = logger;