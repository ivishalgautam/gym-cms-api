"use strict";
import controller from "./controller.js";

export const schema = {
  body: {
    type: "object",
    properties: {
      documents: { type: "object" },
    },
    required: ["documents"],
  },
};

export default async function routes(fastify, options) {
  fastify.post("/", schema, controller.create);
  fastify.delete("/:id", {}, controller.deleteById);
  fastify.get("/:id", {}, controller.getById);
  fastify.get("/", {}, controller.get);
  fastify.put("/:id", {}, controller.updateById);
}
