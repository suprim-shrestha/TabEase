import { config } from "dotenv";

const pathToEnv = __dirname + "/../.env";

config({ path: pathToEnv });

const serverConfig = {
  serverPort: process.env.SERVER_PORT || 3000,
  frontendUrl: process.env.FRONTEND_URL,
  backendUrl: process.env.BACKEND_URL,

  saltRounds: Number(process.env.SALT_ROUNDS),
  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
  },

  cookie: {
    secret: process.env.COOKIE_SECRET,
    maxAge: Number(process.env.COOKIE_MAX_AGE),
    refreshMaxAge: Number(process.env.COOKIE_REFRESH_MAX_AGE),
  },

  database: {
    charset: "utf8",
    client: process.env.DB_CLIENT,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    timezone: "UTC",
    user: process.env.DB_USER,
  },
};

export default serverConfig;
