"use strict";
import constants from "../../lib/constants/index.js";
import { DataTypes, QueryTypes, Deferrable } from "sequelize";

let NoteModel = null;

const init = async (sequelize) => {
  NoteModel = sequelize.define(
    constants.models.FOLLOW_UP_TABLE,
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Title is required!" },
          notEmpty: { msg: "Title is required!" },
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "Content is required!" },
          notEmpty: { msg: "Content is required!" },
        },
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: { msg: "Please select valid date!" },
          notNull: { msg: "Please select valid date!" },
          notEmpty: { msg: "Please select valid date!" },
        },
      },
      lead_id: {
        type: DataTypes.UUID,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: constants.models.LEAD_TABLE,
          key: "id",
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
        validate: {
          isUUID: 4,
        },
      },
      sales_person_id: {
        type: DataTypes.UUID,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: constants.models.SALES_PERSON_TABLE,
          key: "id",
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
        validate: {
          isUUID: 4,
        },
      },
      is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  await NoteModel.sync({ alter: true });
};

const create = async (req) => {
  return await NoteModel.create({
    title: req.body.title,
    content: req.body.content,
    date: req.body.date,
    lead_id: req.body.lead_id,
    sales_person_id: req.body.sales_person_id,
  });
};

const update = async (req, id) => {
  return await NoteModel.update(
    {
      title: req.body.title,
      content: req.body.content,
      date: req.body.date,
      is_completed: req.body.is_completed,
    },
    {
      where: {
        id: req.params.id || id,
      },
      returning: true,
      raw: true,
    }
  );
};

const get = async (req) => {
  let whereQuery = "";
  if (req.user_data.role === "customer") {
    whereQuery = `fu.lead_id = '${req.user_data.id}'`;
  }

  let query = `
  SELECT
    *
    FROM followups fu
    ${whereQuery}
  `;

  return await NoteModel.sequelize.query(query, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const getById = async (req, id) => {
  return await NoteModel.findOne({
    where: { id: req.params.id || id },
    raw: true,
  });
};

const getByLeadId = async (req, id) => {
  return await NoteModel.findAll({
    where: { lead_id: req.params.id || id },
    order: [["created_at", "DESC"]],
    attributes: {
      exclude: ["sales_person_id", "lead_id", "updated_at"],
    },
    raw: true,
  });
};

const getByUserId = async (req, lead_id) => {
  let query = `
    SELECT
      *
      FROM followups fu
      fu.sales_person_id = '${req.user_data.id}' AND fu.lead_id = '${
    req.params.id || lead_id
  }'
    `;

  return await NoteModel.sequelize.query(query, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const deleteById = async (req, id) => {
  return await NoteModel.destroy({
    where: { id: req.params.id || id },
  });
};

export default {
  init: init,
  create: create,
  update: update,
  getById: getById,
  getByUserId: getByUserId,
  deleteById: deleteById,
  getByLeadId: getByLeadId,
  get: get,
};
