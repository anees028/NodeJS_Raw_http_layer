import express, { Request, Response, NextFunction } from 'express';

const PORT = 3000

// The "Bouncer" Middleware
const requireApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['api-key'];

  if (apiKey && apiKey === 'secret-123') {
    // Authorized! Pass to the next handler.
    next();
  } else {
    // Rejected! Send error and STOP the chain (do not call next).
    res.status(403).json({ error: 'Forbidden: Invalid API Key' });
  }
};

const app = express();

app.use(express.json());

// 1. The Router (GET)
app.get('/', (req: Request, res: Response) => {
  // Express handles headers and status codes automatically (defaults to 200)
  res.json({ message: 'Server is active, and simple route is working fine', uptime: process.uptime() });
});


app.post('/login', requireApiKey, (req: Request, res: Response) => {

    const {username, password} = req.body;
    if(username === 'admin' && password === 'password123'){
        res.json({ message: 'Login successful!' });
    } else {
        res.status(401).json({ error: 'Unauthorized: Invalid credentials' });
    }
});





app.listen(PORT, () => {
  console.log(`Express Server running on port ${PORT}`);
});

