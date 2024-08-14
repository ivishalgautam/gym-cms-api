export const schema = {
  post: {
    body: {
      type: "object",
      properties: {
        name: { type: "string", minLength: 1 },
        duration_in_months: { type: "number", minimum: 1 },
        price: { type: "number", minimum: 0 },
        required: ["name", "duration_in_months", "price"],
      },
    },
  },
  put: {
    body: {
      type: "object",
      properties: {
        name: { type: "string", minLength: 1 },
        duration_in_months: { type: "number", minimum: 1 },
        price: { type: "number", minimum: 0 },
      },
    },
    params: {
      type: "object",
      properties: { id: { type: "string", format: "uuid" } },
      required: ["id"],
    },
  },
  checkParams: {
    params: {
      type: "object",
      properties: { id: { type: "string", format: "uuid" } },
      required: ["id"],
    },
  },
};
