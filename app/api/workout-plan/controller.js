"use strict";
import table from "../../db/models.js";
import { ErrorHandler } from "../../helpers/handleError.js";

const create = async (req, res) => {
  const customerRecord = await table.CustomerModel.getById(
    0,
    req.body.customer_id
  );
  if (!customerRecord)
    return ErrorHandler({ code: 404, message: "Customer not found!" });

  await table.WorkoutPlanModel.create(req);
  res.send({ status: true, message: "Plan created." });
};

const update = async (req, res) => {
  const record = await table.WorkoutPlanModel.getById(req.body.customer_id);
  if (!record)
    return ErrorHandler({ code: 404, message: "Customer not found!" });

  await table.WorkoutPlanModel.update(req);
  res.send({ status: true, message: "Plan updated." });
};

const deleteById = async (req, res) => {
  const record = await table.WorkoutPlanModel.getById(req.body.customer_id);
  if (!record)
    return ErrorHandler({ code: 404, message: "Customer not found!" });

  await table.WorkoutPlanModel.deleteById(req);
  res.send({ status: true, message: "Plan deleted." });
};

const getById = async (req, res) => {
  const record = await table.WorkoutPlanModel.getById(req.body.customer_id);
  if (!record)
    return ErrorHandler({ code: 404, message: "Workout plan not found!" });

  res.send({ status: true, data: record });
};

export default {
  create: create,
  update: update,
  deleteById: deleteById,
  getById: getById,
};
