import * as http from 'http';

const PORT = 3000;

// In Node.js, the Internet works exactly the same way:
// The Request (req) is a Readable Stream (Data coming from the user).
// The Response (res) is a Writable Stream (Data you send back).

const server = http.createServer((req, res) => {
  // 1. Handle the URL and Method
  if (req.url === '/status' && req.method === 'GET') {
    // 2. Set Headers (Important for Clients/Browsers)
    res.writeHead(200, { 'Content-Type': 'application/json' });
    
    // 3. Write data to the stream
    res.write(JSON.stringify({ message: 'Server is active', uptime: process.uptime() }));
    
    // 4. Close the stream
    res.end();
  } 
  else {
    // Handle 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
