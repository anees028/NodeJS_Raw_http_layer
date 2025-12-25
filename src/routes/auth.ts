import { Router, Request, Response } from "express";
import { credentialsAuth } from "../middleware/credentialsAuth";

const router = Router();

router.post("/login", credentialsAuth, (req: Request, res: Response) => {
  const { email, age, gender, city, country } = req.body || {};
  const username =
    (req as any).user?.username || String(req.headers["username"] || "");

  const message = `Welcome, ${email}! Your age is ${age}, gender is ${gender}, city is ${city} and country is ${country}.`;

  const responseData = {
    username,
    message,
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(responseData);
});

export default router;
