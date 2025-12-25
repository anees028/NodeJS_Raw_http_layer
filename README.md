# Raw HTTP Layer — Phase 2 🔧

**The perfect bridge. Most developers jump straight to Express and assume `req.body` just "exists."**

Welcome to Phase 2: **The Raw HTTP Layer** — we build a server *without* Express or NestJS so you can learn the mechanics they hide from you. This example lives in `raw-server.ts` and demonstrates how Node.js handles HTTP as streams.

---

## Why this matters (Interview-critical) ❗

In a Backend Engineering interview, a senior engineer might ask:

> "If I remove the body-parser library from your Express app, how would you access the JSON data sent by the client?"

If you only know frameworks, you will fail this question. Frameworks like Express simply implement the chunk-collecting-and-parsing logic for you. Understanding the raw layer shows that the request (`req`) is a Readable Stream and the response (`res`) is a Writable Stream.

---

## Concept: HTTP is just Streams 🌊

- Reading a file = Readable Stream
- Writing a file = Writable Stream
- The same applies to HTTP in Node.js:
  - `req` is a **Readable Stream** (data coming from the client).
  - `res` is a **Writable Stream** (data you send back).

When a client uploads a large payload, it arrives in chunks (buffers). You must collect those chunks, then combine and parse them.

---

## What the example shows (`raw-server.ts`) ✨

- GET `/status` — returns a JSON status with uptime.
- POST `/process-data` — illustrates how to collect chunks and parse JSON manually.
- Basic 404 handler for unmatched routes.

### Quick usage (run locally)

Requirements: Node.js (>=14+), TypeScript (dev). Run directly with:

```bash
npx ts-node raw-server.ts
# or compile and run
npx tsc && node dist/raw-server.js
```

Test the endpoints:

- GET /status

```bash
curl -i http://localhost:3000/status
```

- POST /process-data

```bash
curl -i -X POST http://localhost:3000/process-data \
  -H "Content-Type: application/json" \
  -d '{"name":"alice","age":30}'
```

Expected POST response (200):

```json
{
  "received": { "name": "alice", "age": 30 },
  "message": "Data processed successfully",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

---

## Step 3: The Hard Part (Handling POST data) 🧠

When a client sends JSON via POST, it doesn't arrive all at once. Follow these steps (the code in `raw-server.ts` implements this):

1. Create a container for chunks (e.g., `const bodyChunks: Buffer[] = []`).
2. Listen for the `data` event to collect buffers: `req.on('data', chunk => bodyChunks.push(chunk))`.
3. Listen for the `end` event to know the body is complete: `req.on('end', () => { /* combine and parse */ })`.
4. Combine chunks: `const fullBuffer = Buffer.concat(bodyChunks)`.
5. Convert to string: `const bodyString = fullBuffer.toString()`.
6. Parse JSON with `JSON.parse(bodyString)` and handle parsing errors with `try/catch`.

Code excerpt:

```typescript
// inside POST /process-data
const bodyChunks: Buffer[] = [];
req.on('data', (chunk) => bodyChunks.push(chunk));
req.on('end', () => {
  const fullBuffer = Buffer.concat(bodyChunks);
  const bodyString = fullBuffer.toString();
  try {
    const parsedData = JSON.parse(bodyString);
    // send response
  } catch (err) {
    res.writeHead(400, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({ error: 'Invalid JSON format' }));
  }
});
```

> Note: The response logic must run *inside* the `end` handler — otherwise the server may respond before the body arrives.

---

## What did we just learn? (The "Why") ✅

- **Buffer handling**: `express.json()` effectively performs these chunk-collection and parsing steps for you and attaches `req.body`.
- **Async nature**: You must respond after the `end` event — putting response code outside can cause race conditions.
- **Headers**: Set `Content-Type: application/json` in responses so clients know how to interpret the payload.

---

## The problem with the raw approach ⚠️

- It's verbose: parsing bodies manually adds lots of repeated code.
- Scaling routes: An `if/else` chain across many routes becomes a maintenance nightmare.
- Cross-cutting concerns: Authentication, validation, logging, and error handling are harder to reuse without a middleware pattern.
- Security/performance extras: You must guard against large payloads (limit body size), slow clients, and DoS attacks.

How real apps address this:

- Use a small body parser function or middleware helper (one place for parsing + size limits + error handling).
- Implement a simple router instead of multiple `if/else` checks.
- Use production-ready frameworks (Express, Fastify) once you understand the raw mechanics.

---

## Interview answer (short, precise) 💬

"Without `body-parser`, you'd access JSON by listening to `req` events: collect `data` chunks into a buffer, wait for `end`, concat buffers, convert to string, then `JSON.parse`. `body-parser` (and `express.json()` today) just encapsulate this process and attach the parsed object to `req.body`."

---

## Tips & Improvements 💡

- Validate `Content-Type` header before parsing (e.g., only parse when `content-type` contains `application/json`).
- Implement a max body size to prevent memory exhaustion.
- Use a small utility `parseJsonBody(req, maxBytes)` that returns a Promise to simplify route handlers.
- Replace `if/else` with a tiny router (Map<method+path, handler>) to keep code tidy.


---

## License

MIT — feel free to use and modify for learning and interviews.

> If you want, I can also add a small `parseJsonBody` helper or convert this to a minimal router in a follow-up PR. 🔧
