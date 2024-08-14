export const schema = {
  post: {
    body: {
      type: "object",
      properties: {
        plan: { type: "array", minItems: 1 },
        customer_id: { type: "string", format: "uuid" },
      },
      required: ["plan", "customer_id"],
    },
  },
  put: {
    body: {
      type: "object",
      properties: {
        plan: { type: "array", minItems: 1 },
      },
    },
    params: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
      },
      required: ["id"],
    },
  },
  checkParams: {
    params: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
      },
      required: ["id"],
    },
  },
};
