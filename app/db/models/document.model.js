"use strict";
import constants from "../../lib/constants/index.js";
import { DataTypes, QueryTypes, Deferrable } from "sequelize";

let DocumentModel = null;

const init = async (sequelize) => {
  DocumentModel = sequelize.define(
    constants.models.DOCUMENT_TABLE,
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: constants.models.USER_TABLE,
          key: "id",
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
        validate: {
          isUUID: 4,
        },
      },
      documents: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: [],
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  await DocumentModel.sync({ alter: true });
};

const create = async (req, user_id) => {
  return await DocumentModel.create({
    documents: req.body.documents,
    user_id: req.body.user_id || user_id,
  });
};

const update = async (req, task_id) => {
  return await DocumentModel.update(
    {
      documents: req.body.documents,
    },
    {
      where: {
        id: req.params.id || task_id,
      },
      returning: true,
      raw: true,
    }
  );
};

const get = async (req, id) => {
  let whereQuery = "";
  if (req.user_data.role === "customer") {
    whereQuery = `d.user_id = '${req.user_data.id}'`;
  }

  let query = `
  SELECT
    *
    FROM documents d
    ${whereQuery}
  `;

  return await DocumentModel.sequelize.query(query, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const getById = async (req, id) => {
  return await DocumentModel.findOne({
    where: { id: req.params.id || id },
    raw: true,
  });
};

const deleteById = async (req, id) => {
  return await DocumentModel.destroy({
    where: { id: req.params.id || id },
  });
};

export default {
  init: init,
  create: create,
  update: update,
  getById: getById,
  deleteById: deleteById,
  get: get,
};
