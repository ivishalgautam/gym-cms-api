"use strict";

const constants = {
  environment: {
    LOCAL: "local",
    DEVELOPMENT: "development",
    TEST: "test",
    PRODUCTION: "production",
  },
  http: {
    status: {
      OK: 200,
      CREATED: 201,
      ACCEPTED: 202,
      NOCONTENT: 204,
      MULTI_STATUS: 207,
      REDIRECT: 301,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      CONFLICT: 409,
      INTERNAL_SERVER_ERROR: 500,
      NOT_FOUND: 404,
    },
  },
  error: {
    validation: {},
    message: {
      // HTTP Status code messages
      HTTP_STATUS_CODE_201: "Created",
      HTTP_STATUS_CODE_400: "Bad Request.",
      HTTP_STATUS_CODE_301: "Redirect to other url",
      HTTP_STATUS_CODE_401: "Unauthorized.",
      HTTP_STATUS_CODE_403: "Forbidden.",
      HTTP_STATUS_CODE_404: "The specified resource was not found.",
      HTTP_STATUS_CODE_409: "Resource already exists",
      HTTP_STATUS_CODE_500: "Internal Server Error.",
      INVALID_LOGIN: "Invalid Login",
      EMAIL_MISSING: "Email Missing",
      PAYMENT_ACCOUNT_ID_MISSING: "Payment Account Id Missing",
      INVALID_PAYMENT_ACCOUNT_ID: "Invalid Payment Account Id provided",
    },
  },
  models: {
    USER_TABLE: "users",
    LEAD_TABLE: "leads",
    OTP_TABLE: "otps",
    CUSTOMER_TABLE: "customers",
    SALES_PERSON_TABLE: "sales_persons",
    TRAINER_TABLE: "trainers",
    MEMBERSHIP_TABLE: "memberships",
    SUBSCRIPTION_FOR_TRAINER_TABLE: "subsription_for_trainers",
    MEMBERSHIP_PERKS_TABLE: "membership_perks",
    CUSTOMER_MEMBERSHIP_TABLE: "customer_memberships",
    TRAINER_MEMBERSHIP_TABLE: "trainer_memberships",
    OFFER_TABLE: "offers",
    FEEDBACK_TABLE: "feedbacks",
    CUSTOMER_FREEZE_MEMBERSHIP_TABLE: "freeze_memberships",
    TASK_TABLE: "tasks",
    NOTE_TABLE: "notes",
    DOCUMENT_TABLE: "documents",
    FOLLOW_UP_TABLE: "followups",
    WORKOUT_PLAN_TABLE: "workout_plans",
    DIET_PLAN_TABLE: "diet_plans",
  },
  bcrypt: {
    SALT_ROUNDS: 10,
  },
  time: {
    TOKEN_EXPIRES_IN: 24 * 60 * 60 * 1000, // 15 * 1 minute = 15 minutes
    REFRESH_TOKEN_EXPIRES_IN: "1d", // 1 day
  },
};

export default constants;
