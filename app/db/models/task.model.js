"use strict";
import constants from "../../lib/constants/index.js";
import { DataTypes, QueryTypes, Deferrable } from "sequelize";

let TaskModel = null;

const init = async (sequelize) => {
  TaskModel = sequelize.define(
    constants.models.TASK_TABLE,
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
          notEmpty: { msg: "Content is required!" },
        },
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  await TaskModel.sync({ alter: true });
};

const create = async (req, user_id) => {
  return await TaskModel.create({
    title: req.body.title,
    content: req.body.content,
    user_id: req.body.user_id || user_id,
  });
};

const update = async (req, task_id) => {
  return await TaskModel.update(
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

const get = async (req, id) => {
  let whereQuery = "";
  if (req.user_data.role === "customer") {
    whereQuery = `t.user_id = '${req.user_data.id}'`;
  }

  let query = `
  SELECT
    *
    FROM tasks t
    ${whereQuery}
  `;

  return await TaskModel.sequelize.query(query, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const getById = async (req, id) => {
  return await TaskModel.findOne({
    where: { id: req.params.id || id },
    raw: true,
  });
};

const deleteById = async (req, id) => {
  return await TaskModel.destroy({
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
