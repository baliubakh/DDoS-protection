import express, { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import path from "path";
import IpHandler from "./ipController";

const app = express();
const PORT = 3000;

let limiterEnabled = true; 

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, 
  handler: (req: Request, res: Response) => {
    req.ip && IpHandler.addIpAddress(req.ip);
    res.status(429).send("Too many requests, please try again later.");
  },
});

const conditionalLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (limiterEnabled) {
    return limiter(req, res, next);
  }
  next();
};

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get(
  "/home",
  conditionalLimiter,
  async (req: Request, res: Response) => {
    console.log(req.ip)
    res.sendFile(path.join(__dirname, "views", "index.html"));
  }
);

app.get("/editor", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "views", "editor.html"));
});


app.post("/toggle-limiter", (req: Request, res: Response) => {
  limiterEnabled = !limiterEnabled;
  res.json({ limiterEnabled });
});


app.post("/api/iplist/add", async (req: Request, res: Response) => {
  const { ip } = req.body;
  await IpHandler.addIpAddress(ip);
  res.sendStatus(200);
});

app.post("/api/iplist/delete", async (req: Request, res: Response) => {
  const { ip } = req.body;
  await IpHandler.deleteIpAddress(ip);
  res.sendStatus(200);
});

app.get("/api/iplist", async (req: Request, res: Response) => {
  const ipList = await IpHandler.getIpList();
  res.json(ipList);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
