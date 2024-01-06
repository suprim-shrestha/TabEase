import express from "express";

import config from "./config";

const app = express();

console.log(`Server listening on port: ${config.serverPort}`);

app.listen(config.serverPort);
