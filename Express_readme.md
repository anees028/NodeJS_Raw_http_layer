# Express & The Middleware Pattern — Phase 2 🚦

**Great. You felt the pain of manual body parsing and if/else routing — now see how Express simplifies it.**

We are moving from "building the engine parts manually" to "assembling the car." Express gives you two powerful primitives:

- **Router** — No more `if (req.url === ...)` chains.
- **Middleware** — Code that runs between the request arriving and the response leaving.

---

## Run it 🔧

Start the example server (from the project root):

```bash
npx ts-node express-server.ts
```

Open the server and test routes with `curl` or Postman.

---

## The Aha! Moment ✨

The line `app.use(express.json())` in Express does exactly what you implemented manually in the raw HTTP server: it listens to the request stream, buffers chunks, parses JSON, and attaches the result to `req.body` — then calls `next()` so the request proceeds through the middleware chain.

---

## Step 3: Deep Dive into Middleware (Interview core) 🧠

Middleware is the single most important concept in Express (and later NestJS).

Conceptual model (airport security):

- Request — you (the passenger) arrive.
- Middleware 1: Ticket checker (if no ticket, stop here).
- Middleware 2: Metal detector (if alarm, stop here).
- Route Handler — the plane (final destination).

In code, middleware is simply a function with 3 args:

```ts
function (req, res, next) {
  // do something
  next(); // pass control to the next middleware
}
```

- `req`: incoming data
- `res`: response tool
- `next`: call to continue the pipeline

---

## Task: Create a Request Logger (example)

Add this middleware to log each request's time and method:

```ts
// requestLogger.ts (or inline in express-server.ts)
import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next(); // IMPORTANT — without this, the request will hang
}

// Usage in express-server.ts
app.use(requestLogger);
```

Interview trap question:

> "I added a logging middleware, but my requests are timing out (spinning forever). The console shows the log, but no response comes back. What did I forget?"

Answer: **You forgot to call `next()` (or send a response)** inside the middleware.

---

## Step 4: Middleware for Authentication (Guard) 🔐

Create a simple auth guard that requires a header, e.g., `x-api-key: secret`.

```ts
// authGuard.ts
import { Request, Response, NextFunction } from 'express';

export function authGuard(req: Request, res: Response, next: NextFunction) {
  const key = req.header('x-api-key');
  if (!key || key !== 'secret') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Protected route usage
app.get('/protected', authGuard, (req, res) => {
  res.json({ message: 'Protected content' });
});
```

Try it with curl:

```bash
curl -i http://localhost:3000/protected -H "x-api-key: secret"

# Missing or wrong key -> 401
curl -i http://localhost:3000/protected
```

---

## Phase 2 Summary & Checkpoint ✅

We now understand:

- **Express simplifies HTTP boilerplate** (routing + parsing).
- **Middleware creates a pipeline**: Logging -> Auth -> Parsing -> Controller.
- **Order matters**: `app.use()` order defines the flow. Misplacing error handlers or middleware breaks behavior.

---

## Tips & Best Practices 💡

- **Always call `next()`** unless you send a response.
- Validate `Content-Type` and check body sizes for safety.
- Keep middleware focused and composable (single responsibility).
- Use route-specific middleware for guards instead of mixing concerns.
