"use strict";
import constants from "../../lib/constants/index.js";
import table from "../../db/models.js";
import fileController from "../upload_files/controller.js";
import { ErrorHandler } from "../../helpers/handleError.js";

const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = constants.http.status;

const create = async (req, res) => {
  await table.DocumentModel.create(req, req.user_data.id);
  res.send({ status: true, message: "Document created." });
};

const getById = async (req, res) => {
  const record = await table.DocumentModel.getById(req);

  if (!record) {
    return ErrorHandler({ code: NOT_FOUND, message: "Documents not found!" });
  }

  res.send({ status: true, data: record });
};

const updateById = async (req, res) => {
  const record = await table.DocumentModel.update(req, req.params.id);

  if (!record) {
    return ErrorHandler({ code: NOT_FOUND, message: "Document not found!" });
  }

  res.send({ status: true, data: record });
};

const get = async (req, res) => {
  const queries = await table.DocumentModel.get(req);
  res.send({ status: true, data: queries });
};

const deleteById = async (req, res) => {
  const record = await table.DocumentModel.getById(req, req.params.id);

  if (!record)
    return ErrorHandler({ code: NOT_FOUND, message: "Document not found!" });
  const data = await table.DocumentModel.deleteById(req, req.params.id);
  if (data) {
    record.documents.forEach(async (document) => {
      req.query.file_path = document;
      await fileController.deleteFile(req, res);
    });
  }
  res.send({ status: true, message: "Document deleted." });
};

export default {
  create: create,
  get: get,
  deleteById: deleteById,
  getById: getById,
  updateById: updateById,
};
