const fs = require('fs');

const logFilePath = "logs.txt";
const maxBufferSize = 512; 
let logBuffer = ''; 

function logger(req, res, next) {
  const logMessage = `[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.url}\n`;
  logBuffer += logMessage;

  if (logBuffer.length >= maxBufferSize) {
    flushLogsToFile();
  }
  next();
}

function flushLogsToFile() {
  fs.appendFile(logFilePath, logBuffer, (err) => {
    if (err) {
      console.error('Error writing logs to file:', err);
    } else {
      console.log('Logs flushed to file');
    }
  });

  logBuffer = '';
}


module.exports = logger;