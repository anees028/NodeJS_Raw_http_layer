import * as http from 'http';

const PORT = 3000;

const server = http.createServer((req, res) => {
  // This function runs EVERY time a request hits the server.
  console.log(`Incoming request: ${req.method} ${req.url}`);
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
