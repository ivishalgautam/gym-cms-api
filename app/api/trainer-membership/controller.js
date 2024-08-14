"use strict";
import constants from "../../lib/constants/index.js";
import table from "../../db/models.js";
import { ErrorHandler } from "../../helpers/handleError.js";

const { NOT_FOUND } = constants.http.status;

const create = async (req, res) => {
  await table.TrainerMembershipModel.create(req);
  res.send({ status: true, message: "Trainer membership created." });
};

const getById = async (req, res) => {
  const record = await table.TrainerMembershipModel.getById(req);

  if (!record) {
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Trainer membership not found!",
    });
  }

  res.send({ status: true, data: record });
};

const update = async (req, res) => {
  const record = await table.TrainerMembershipModel.getById(req);
  if (!record)
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Trainer membership not found!",
    });

  await table.TrainerMembershipModel.update(req);
};

const get = async (req, res) => {
  const queries = await table.TrainerMembershipModel.get(req);
  res.send({ status: true, data: queries });
};

const deleteById = async (req, res) => {
  const record = await table.TrainerMembershipModel.getById(req);

  if (!record)
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Trainer membership not found!",
    });

  await table.TrainerMembershipModel.deleteById(req);
  res.send({ status: true, message: "Trainer membership deleted." });
};

export default {
  create: create,
  get: get,
  deleteById: deleteById,
  getById: getById,
  update: update,
};
