"use strict";
import constants from "../../lib/constants/index.js";
import table from "../../db/models.js";
import { ErrorHandler } from "../../helpers/handleError.js";

const { NOT_FOUND } = constants.http.status;

const getById = async (req, res) => {
  const record = await table.CustomerModel.getById(req);

  if (!record) {
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Customer not found!",
    });
  }

  res.send({ status: true, data: record });
};

const update = async (req, res) => {
  const record = await table.CustomerModel.getById(req);
  if (!record)
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Customer not found!",
    });

  await table.CustomerModel.update(req);
};

const get = async (req, res) => {
  const customers = await table.CustomerModel.get(req);
  res.send({ status: true, data: customers });
};

const deleteById = async (req, res) => {
  const record = await table.CustomerModel.getById(req);

  if (!record)
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Customer membership not found!",
    });

  await table.CustomerModel.deleteById(req);
  res.send({ status: true, message: "Customer membership deleted." });
};

export default {
  get: get,
  deleteById: deleteById,
  getById: getById,
  update: update,
};
