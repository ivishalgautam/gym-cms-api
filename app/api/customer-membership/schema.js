export const schema = {
  post: {
    body: {
      type: "object",
      properties: {
        user_id: { type: "string" },
        subscription_id: { type: "string" },
      },
      required: ["user_id", "subscription_id"],
    },
  },
  freezeMembership: {
    body: {
      type: "object",
      properties: {
        start_date: { type: "string" },
        end_date: { type: "string" },
      },
      required: ["start_date", "end_date"],
    },
    params: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
      },
      required: ["id"],
    },
  },
  transferMembership: {
    body: {
      type: "object",
      properties: {
        user_id: { type: "string" },
      },
      required: ["user_id"],
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
