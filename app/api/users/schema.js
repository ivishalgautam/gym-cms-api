const createUserSchema = {
  body: {
    type: "object",
    required: ["username", "password", "fullname", "mobile_number", "role"],
    properties: {
      username: { type: "string", minLength: 3 },
      password: { type: "string", minLength: 3 },
      fullname: { type: "string", minLength: 3 },
      email: { type: "string", minLength: 3 },
      mobile_number: { type: "string", minLength: 3 },
      role: { type: "string", minLength: 3 },
      avatar: { type: "string", minLength: 3 },
    },
  },
};

export default {
  createUserSchema: createUserSchema,
};
