"use strict";

import controller from "./controller.js";
import schema from "./schema.js";

export default async function routes(fastify, options) {
  fastify.post("/", { schema: schema.createUserSchema }, controller.create);
  fastify.post("/:id/change-password", {}, controller.updatePassword);
  fastify.put("/:id", {}, controller.update);
  fastify.put("/status/:id", {}, controller.updateStatus);
  fastify.get("/me", {}, controller.getUser);
  fastify.get("/", {}, controller.get);
  fastify.get("/get/trainers", {}, controller.getTrainers);
  fastify.get("/:id", {}, controller.getById);
  fastify.delete("/:id", {}, controller.deleteById);
}
