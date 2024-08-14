import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import { fileURLToPath } from "url";
import cors from "@fastify/cors";
import { dirname } from "path";
import path from "path";
import fastifyView from "@fastify/view";
import ejs from "ejs";

import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";

// import internal modules
import authRoutes from "./app/api/auth/routes.js";
import pg_database from "./app/db/postgres.js";
import routes from "./app/routes/v1/index.js";
import uploadFileRoutes from "./app/api/upload_files/routes.js";
import { ErrorHandler } from "./app/helpers/handleError.js";
/*
  Register External packages, routes, database connection
*/

export default (app) => {
  app.setErrorHandler(function (error, req, res) {
    console.error(error);
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Internal Server Error";
    console.log({ errorMessage });
    res.code(statusCode).send({
      status_code: statusCode,
      status: false,
      error: error.name,
      message: errorMessage,
    });
  });
  app.register(fastifyRateLimit, {
    max: Number(process.env.MAX_RATE_LIMIT), // Max requests per minute
    timeWindow: process.env.TIME_WINDOW,
    errorResponseBuilder: (req, context) => {
      return ErrorHandler({ code: 429, message: "Rate limit exceeded." });
    },
  });
  app.register(fastifyHelmet);

  app.register(fastifyStatic, {
    root: path.join(dirname(fileURLToPath(import.meta.url), "public")),
  });

  app.register(cors, { origin: "*" });
  app.register(pg_database);
  app.register(fastifyMultipart, {
    limits: {
      fieldNameSize: 100,
      fieldSize: 100,
      fields: 10,
      fileSize: 1000000,
      headerPairs: 2000,
      parts: 1000,
    },
  });
  // Increase the payload size limit
  app.register(routes, { prefix: "v1" });
  app.register(authRoutes, { prefix: "v1/auth" });

  app.register(fastifyView, {
    engine: {
      ejs: ejs,
    },
  });

  app.register(uploadFileRoutes, { prefix: "v1/upload" });
  // app.post("/v1/users", {}, userController.create);
};
