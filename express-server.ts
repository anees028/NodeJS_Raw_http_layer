import express, { Request, Response, NextFunction } from 'express';

const app = express();
const PORT = 3000;

// 1. THE MAGIC REPLACEMENT
// Remember the 20 lines of "chunk" and "buffer" logic? 
// This ONE line replaces it all. It is built-in Middleware.
app.use(express.json()); 

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

app.listen(PORT, () => {
  console.log(`Express Server running on port ${PORT}`);
});