"use strict";
import controller from "./controller.js";
import { schema } from "./schema.js";

export default async function routes(fastify, options) {
  fastify.get("/:id", { schema: schema.checkParams }, controller.getById);
  fastify.put("/:id", { schema: schema.checkParams }, controller.update);
}
