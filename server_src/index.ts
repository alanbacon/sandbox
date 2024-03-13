import path from "path";
import { fileURLToPath } from "url";
import { calendlyTokens } from "./calendly.js";

import http from "http";
import express, { Request, Response } from "express";
import {
  handleAsyncError,
  logRequestsAndResponses,
} from "./expressHelpers/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createRouter() {
  const router = express.Router();

  router.get(
    "/calendlyTokens",
    handleAsyncError((_req: Request, res: Response) => {
      res.status(200).send(calendlyTokens);
    })
  );

  return router;
}

let listeningApp; // eslint-disable-line no-unused-vars
async function initServer(port: number): Promise<void> {
  const app = express();
  const server = http.createServer(app);

  app.use(logRequestsAndResponses);

  app.use("/public/", express.static(path.join(__dirname, "../../public/")));

  app.get("/sandbox.bundle.js", (_, res) => {
    res.sendFile(path.join(__dirname, "../www_src/sandbox.bundle.js"));
  });

  const router = createRouter();
  app.use("/api/", router);

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../www_src/index.html"));
  });

  await new Promise((resolve) => {
    listeningApp = server.listen(port, () => {
      resolve(null);
    });
  });
  console.log(`Service listening on port ${port}`);
}

initServer(5001).catch((err) => console.log(err));
