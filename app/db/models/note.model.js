"use strict";
import constants from "../../lib/constants/index.js";
import { DataTypes, QueryTypes, Deferrable } from "sequelize";

let NoteModel = null;

const init = async (sequelize) => {
  NoteModel = sequelize.define(
    constants.models.NOTE_TABLE,
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Title is required!" },
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Title is required!" },
        },
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  await NoteModel.sync({ alter: true });
};

const create = async (req, user_id) => {
  return await NoteModel.create({
    title: req.body.title,
    content: req.body.content,
    user_id: req.body.user_id || user_id,
  });
};

const update = async (req, task_id) => {
  return await NoteModel.update(
    {
      title: req.body.title,
      content: req.body.content,
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

const get = async (req) => {
  let whereQuery = "";
  if (req.user_data.role === "customer") {
    whereQuery = `n.user_id = '${req.user_data.id}'`;
  }

  let query = `
  SELECT
    *
    FROM notes n
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
  deleteById: deleteById,
  get: get,
};
