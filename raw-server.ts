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

// Adding post login to process incoming data and respond accordingly
// First collect the data chunks, then process them once the stream ends. And store the data in a buffer to handle it properly.
// Second, parse the bufferstring into JSON using JSON.parse() and respond with a confirmation message. 
// And handle potential errors in parsing.
  else if (req.url === '/process-data' && req.method === 'POST') {
    // A. Create a container for the chunks
    const bodyChunks: Buffer[] = [];

    // B. Listen for incoming data chunks
    req.on('data', (chunk) => {
      bodyChunks.push(chunk); // Store the chunk
    });

    // C. When the stream is finished
    req.on('end', () => {
      // 1. Combine all buffers into one huge buffer
      const fullBuffer = Buffer.concat(bodyChunks);
      
      // 2. Convert to string
      const bodyString = fullBuffer.toString();

      try {
        // 3. Parse JSON (This can fail if user sends bad data!)
        const parsedData = JSON.parse(bodyString);

        // 4. Do our business logic
        const responseData = {
          received: parsedData,
          message: 'Data processed successfully',
          timestamp: new Date().toISOString()
        };

        // 5. Send response

        // Async Nature: Notice we put the response logic inside the req.on('end') callback. 
        // If you put it outside, the response would be sent before the data finished arriving!

        res.writeHead(200, { 'Content-Type': 'application/json' }); 
        // Headers: You must manually set Content-Type: application/json. 
        // If you don't, the client (browser) won't know how to render the data.
        res.end(JSON.stringify(responseData));

      } catch (error) {
        // Handle Invalid JSON
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON format' }));
      }
    });
  }
  else {
    // Handle 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
