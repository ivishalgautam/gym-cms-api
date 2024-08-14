"use strict";
import controller from "./controller.js";
import schema from "./schema.js";

export default async function routes(fastify, options) {
  fastify.post("/", { schema: schema.create }, controller.create);
  fastify.delete("/:id", {}, controller.deleteById);
  fastify.get("/:id", {}, controller.getById);
  fastify.put("/:id", {}, controller.update);
  fastify.get("/", {}, controller.get);
}
