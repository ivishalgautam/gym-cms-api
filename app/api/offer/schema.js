export const schema = {
  post: {
    body: {
      type: "object",
      properties: {
        title: { type: "string", minLength: 3 },
        description: { type: "string", minLength: 3 },
        image: { type: "string", minLength: 3 },
        coupon_code: { type: "string", minLength: 3 },
      },
      required: ["title", "description", "image", "coupon_code"],
    },
  },
  put: {
    body: {
      type: "object",
      properties: {
        title: { type: "string", minLength: 3 },
        description: { type: "string", minLength: 3 },
        image: { type: "string", minLength: 3 },
        coupon_code: { type: "string", minLength: 3 },
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
