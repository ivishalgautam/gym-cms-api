const create = {
  body: {
    type: "object",
    properties: {
      content: { type: "string", minLength: 3 },
    },
    required: ["content"],
  },
};

export default { create: create };
