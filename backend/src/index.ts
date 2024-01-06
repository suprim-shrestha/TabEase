import express from "express";

import config from "./config";
import routes from "./routes";

import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/errorHandler.middleware";

const app = express();

app.use(express.json());

app.use(routes);

app.use(errorHandler);

app.use(notFoundHandler);

console.log(`Server listening on port: ${config.serverPort}`);

app.listen(config.serverPort);
