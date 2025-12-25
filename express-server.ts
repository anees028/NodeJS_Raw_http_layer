import express, { Request, Response, NextFunction } from 'express';

const app = express();
const PORT = 3000;

// Define custom middleware
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const method = req.method;
  const url = req.url;

  console.log(`[${new Date().toISOString()}] Incoming: ${method} ${url}`);

  // CRITICAL: You must call next()!
  // If you don't, the request hangs here forever, and the browser spins indefinitely.
  next(); 
};

// The "Bouncer" Middleware
const requireApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];

  if (apiKey && apiKey === 'secret-123') {
    // Authorized! Pass to the next handler.
    next();
  } else {
    // Rejected! Send error and STOP the chain (do not call next).
    res.status(403).json({ error: 'Forbidden: Invalid API Key' });
  }
};


// 1. THE MAGIC REPLACEMENT
// Remember the 20 lines of "chunk" and "buffer" logic? 
// This ONE line replaces it all. It is built-in Middleware.
app.use(express.json()); 
app.use(requestLogger);

// 2. The Router (GET)
app.get('/status', (req: Request, res: Response) => {
  // Express handles headers and status codes automatically (defaults to 200)
  res.json({ message: 'Server is active', uptime: process.uptime() });
});

// 3. The Router (POST)
app.post('/process-data', (req: Request, res: Response) => {
  // express.json() already parsed the body and attached it to req.body
  const receivedData = req.body; 

  // We can access properties directly immediately
  const responseData = {
    received: receivedData,
    message: 'Data processed successfully',
    timestamp: new Date().toISOString()
  };

  res.status(200).json(responseData);
});

// A Protected Route
// Notice we pass the middleware as the second argument, just for this route
app.get('/secret-data', requireApiKey, (req: Request, res: Response) => {
  res.json({ secret: 'The treasure is hidden under the big T.' });
});

app.listen(PORT, () => {
  console.log(`Express Server running on port ${PORT}`);
});