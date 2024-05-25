
const requestCounts = new Map();
const maxRequestsPerMinute = 20; 

function rateLimiter(req, res, next) {
  const ip = req.ip; 
  const currentTime = Math.floor(Date.now() / 1000);

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }

  const requests = requestCounts.get(ip).filter((timestamp) => currentTime - timestamp < 60);
  requestCounts.set(ip, requests);

  if (requests.length >= maxRequestsPerMinute) {
    return res.status(429).send('Too many requests from this IP, please try again later.');
  }
  requestCounts.get(ip).push(currentTime);

  next();
}

module.exports = rateLimiter;