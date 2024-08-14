"use strict";
import table from "../../db/models.js";
import { ErrorHandler } from "../../helpers/handleError.js";

const create = async (req, res) => {
  await table.OffersModel.create(req);
  res.send({ status: true, message: "Offer created." });
};

const update = async (req, res) => {
  const record = await table.OffersModel.getById(req);
  if (!record) return ErrorHandler({ code: 404, message: "Offer not found!" });

  await table.OffersModel.update(req);
  res.send({ status: true, message: "Offer updated." });
};
const deleteById = async (req, res) => {
  const record = await table.OffersModel.getById(req);
  if (!record) return ErrorHandler({ code: 404, message: "Offer not found!" });

  await table.OffersModel.deleteById(req);
  res.send({ status: true, message: "Offer updated." });
};

const getById = async (req, res) => {
  const record = await table.OffersModel.getById(req);
  if (!record) return ErrorHandler({ code: 404, message: "Offer not found!" });

  res.send({ status: true, data: record });
};

const get = async (req, res) => {
  res.send({ status: true, data: await table.OffersModel.get(req) });
};

export default {
  create: create,
  update: update,
  deleteById: deleteById,
  getById: getById,
  get: get,
};
