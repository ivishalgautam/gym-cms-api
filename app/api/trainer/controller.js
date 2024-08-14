"use strict";
import constants from "../../lib/constants/index.js";
import table from "../../db/models.js";
import { ErrorHandler } from "../../helpers/handleError.js";

const { NOT_FOUND } = constants.http.status;

const create = async (req, res) => {
  await table.TrainerModel.create(req);
  res.send({ status: true, message: "Trainer created." });
};

const getById = async (req, res) => {
  const record = await table.TrainerModel.getById(req);

  if (!record) {
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Trainer not found!",
    });
  }

  res.send({ status: true, data: record });
};

const update = async (req, res) => {
  const record = await table.TrainerModel.getById(req);
  if (!record)
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Trainer not found!",
    });

  await table.TrainerModel.update(req);
};

const get = async (req, res) => {
  const data = await table.TrainerModel.get(req);
  res.send({ status: true, data: data });
};

const deleteById = async (req, res) => {
  const record = await table.TrainerModel.getById(req);

  if (!record)
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Trainer not found!",
    });

  await table.TrainerModel.deleteById(req);
  res.send({ status: true, message: "Trainer deleted." });
};

export default {
  create: create,
  get: get,
  deleteById: deleteById,
  getById: getById,
  update: update,
};
