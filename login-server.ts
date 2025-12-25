import express, { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';
import 'dotenv/config';

const PORT = process.env.PORT || 3000
const API_KEY = process.env.API_KEY
const FETCH_URL = process.env.FETCH_URL

// The "Bouncer" Middleware
const requireApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['api-key'];

  if (apiKey && apiKey === API_KEY) {
    // Authorized! Pass to the next handler.
    next();
  } else {
    // Rejected! Send error and STOP the chain (do not call next).
    res.status(403).json({ error: 'Forbidden: Invalid API Key' });
  }
};

// Loging Middleware
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    // const {username, password} = req.body;
    const apiKey = req.headers['api-key'];
    const username = req.headers['username'];
    const password = req.headers['password'];
    if(username === 'admin' && password === '12345' && apiKey === API_KEY){
        next()
    } else {
        res.status(401).json({ error: 'Unauthorized: Invalid credentials' });
    }
}


const app = express();

app.use(express.json());

// 1. The Router (GET)
app.get('/', (req: Request, res: Response) => {
  // Express handles headers and status codes automatically (defaults to 200)
  res.json({ message: 'Server is active, and simple route is working fine', uptime: process.uptime() });
});


app.post('/login', requestLogger, (req: Request, res: Response) => {

    const {email, age, gender, city, country} = req.body;  
    
    const message =  `Welcome, ${email}! Your age is ${age}, gender is ${gender}, city is ${city} and country is ${country}.`;

    const responseData = {
        username: req.headers['username'],
        message: message,
        timestamp: new Date().toISOString()
    };

    res.status(200).json(responseData);
});

app.get('/get-users', requestLogger, (req: Request, res: Response) => {
    const users = [
        { id: 1, name: 'Alice', email: "alice@example.com" },
        { id: 2, name: 'Bob', email: "bob@example.com" },
        { id: 3, name: 'Charlie', email: "charlie@example.com" }
    ];
    res.status(200).json({ users });
});


let cached: { data: any; expiresAt: number } | null = null;
app.get('/get-users-detail', requestLogger, async (req, res) => {
  try {
    if (cached && cached.expiresAt > Date.now()) return res.json({ users: cached.data });
    const resp = await fetch(FETCH_URL!);
    const users = await resp.json();
    cached = { data: users, expiresAt: Date.now() + 60_000 }; // cache 60s
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});





app.listen(PORT, () => {
  console.log(`Express Server running on port ${PORT}`);
});

