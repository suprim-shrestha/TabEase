import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";

import config from "./config";
import routes from "./routes";

import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/errorHandler.middleware";

const app = express();

app.use(cookieParser(config.cookieSecret));

app.use(express.json());

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

app.use(routes);

app.use(errorHandler);

app.use(notFoundHandler);

console.log(`Server listening on port: ${config.serverPort}`);

app.listen(config.serverPort);
