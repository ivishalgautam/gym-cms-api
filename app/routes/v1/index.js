import jwtVerify from "../../helpers/auth.js";
import userRoutes from "../../api/users/routes.js";
import otpRoutes from "../../api/otp/routes.js";
import leadRoutes from "../../api/lead/routes.js";
import customerRoutes from "../../api/customer/routes.js";
import customerMembershipRoutes from "../../api/customer-membership/routes.js";
import documentRoutes from "../../api/document/routes.js";
import followUpRoutes from "../../api/followup/routes.js";
import noteRoutes from "../../api/note/routes.js";
import membershipRoutes from "../../api/membership/routes.js";
import membershipPerksRoutes from "../../api/membership-perks/routes.js";
import taskRoutes from "../../api/task/routes.js";
import workoutPlanRoutes from "../../api/workout-plan/routes.js";
import trainerRoutes from "../../api/trainer/routes.js";
import freezeMembershipRoutes from "../../api/freeze-membership/routes.js";

export default async function routes(fastify, options) {
  fastify.addHook("onRequest", jwtVerify.verifyToken);
  fastify.register(userRoutes, { prefix: "users" });
  fastify.register(otpRoutes, { prefix: "otp" });
  fastify.register(leadRoutes, { prefix: "leads" });
  fastify.register(customerRoutes, { prefix: "members" });
  fastify.register(customerMembershipRoutes, { prefix: "customerMemberships" });
  fastify.register(documentRoutes, { prefix: "documents" });
  fastify.register(followUpRoutes, { prefix: "followups" });
  fastify.register(noteRoutes, { prefix: "notes" });
  fastify.register(membershipRoutes, { prefix: "memberships" });
  fastify.register(membershipPerksRoutes, { prefix: "membershipPerks" });
  fastify.register(taskRoutes, { prefix: "tasks" });
  fastify.register(workoutPlanRoutes, { prefix: "workoutPlans" });
  fastify.register(trainerRoutes, { prefix: "trainers" });
  fastify.register(freezeMembershipRoutes, { prefix: "freezeMemberships" });
}
