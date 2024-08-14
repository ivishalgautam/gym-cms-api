"use strict";
import controller from "./controller.js";
import { schema } from "./schema.js";

export default async function routes(fastify, options) {
  fastify.post("/", { schema: schema.post }, controller.create);
  fastify.put(
    "/freezeMembership/:id",
    { schema: schema.freezeMembership },
    controller.freezeMembership
  );
  fastify.put("/:id", { schema: schema.checkParams }, controller.update);
  fastify.put(
    "/transferMembership/:id",
    { schema: schema.transferMembership },
    controller.transferMembership
  );
  fastify.get("/:id", { schema: schema.checkParams }, controller.getById);
  fastify.get(
    "/getByCustomerId/:id",
    { schema: schema.checkParams },
    controller.getByCustomerId
  );
  fastify.get("/", {}, controller.get);
  // fastify.delete("/:id", {}, controller.deleteById);
}
