"use strict";
import constants from "../../lib/constants/index.js";
import sequelizeFwk, { QueryTypes } from "sequelize";
const { DataTypes, Deferrable } = sequelizeFwk;

let FeedbackModel = null;

const init = async (sequelize) => {
  FeedbackModel = sequelize.define(
    constants.models.FEEDBACK_TABLE,
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
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Content is required*" },
        },
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  await FeedbackModel.sync({ alter: true });
};

const create = async (req) => {
  return await FeedbackModel.create({
    content: req.body.content,
  });
};

const update = async (req, id) => {
  return await FeedbackModel.update(
    {
      user_id: req.user_data.id,
      content: req.body.content,
    },
    { where: { id: req.params.id || id } }
  );
};

const get = async (req) => {
  return await FeedbackModel.findAll({});
};

const getById = async (req, id) => {
  return await FeedbackModel.findOne({
    where: {
      id: req.params.id || id,
    },
  });
};

const deleteById = async (req, id) => {
  return await FeedbackModel.destroy({
    where: { id: req.params.id || id },
  });
};

export default {
  init: init,
  create: create,
  update: update,
  get: get,
  getById: getById,
  deleteById: deleteById,
};
