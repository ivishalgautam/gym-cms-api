"use strict";
import controller from "./controller.js";

export const schema = {
  body: {
    type: "object",
    properties: {
      name: { type: "string" },
      duration_in_months: { type: "integer" },
      price: { type: "integer" },
    },
    required: ["name", "duration_in_months", "price"],
  },
};

export default async function routes(fastify, options) {
  fastify.post("/", schema, controller.create);
  fastify.delete("/:id", {}, controller.deleteById);
  fastify.get("/:id", {}, controller.getById);
  fastify.get("/", {}, controller.get);
}
