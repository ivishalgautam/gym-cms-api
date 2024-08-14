"use strict";
import userModel from "./models/user.model.js";
import otpModel from "./models/otp.model.js";
import leadModel from "./models/lead.model.js";
import membershipModel from "./models/membership.model.js";
import membershipPerksModel from "./models/membership-perks.model.js";
import customerMembershipModel from "./models/customer-membership.model.js";
import taskModel from "./models/task.model.js";
import noteModel from "./models/note.model.js";
import documentModel from "./models/document.model.js";
import followupModel from "./models/followup.model.js";
import salesPersonModel from "./models/sales-person.model.js";
import trainerModel from "./models/trainer.model.js";
import freezeMembershipModel from "./models/freeze-membership.model.js";
import customerModel from "./models/customer.model.js";
import workoutPlanModel from "./models/workout-plan.model.js";
import dietPlanModel from "./models/diet-plan.model.js";
import trainerMembershipModel from "./models/trainer-membership.model.js";
import offersModel from "./models/offers.model.js";
import feedbackModel from "./models/feedback.model.js";
import subscriptionForTrainerModel from "./models/subscription-for-trainer.model.js";

export default {
  UserModel: userModel,
  OtpModel: otpModel,
  LeadModel: leadModel,
  MembershipModel: membershipModel,
  MembershipPerksModel: membershipPerksModel,
  CustomerMembershipModel: customerMembershipModel,
  TrainerMembershipModel: trainerMembershipModel,
  TaskModel: taskModel,
  NoteModel: noteModel,
  DocumentModel: documentModel,
  FollowupModel: followupModel,
  SalesPersonModel: salesPersonModel,
  TrainerModel: trainerModel,
  CustomerFreezeMembershipModel: freezeMembershipModel,
  CustomerModel: customerModel,
  WorkoutPlanModel: workoutPlanModel,
  DietPlanModel: dietPlanModel,
  OffersModel: offersModel,
  FeedbackModel: feedbackModel,
  SubscriptionForTrainerModel: subscriptionForTrainerModel,
};
