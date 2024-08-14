"use strict";
import { DataTypes, Deferrable } from "sequelize";
import constants from "../../lib/constants/index.js";

let WorkoutPlanModel = null;

const init = async (sequelize) => {
  WorkoutPlanModel = sequelize.define(
    constants.models.WORKOUT_PLAN_TABLE,
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      plan: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      trainer_id: {
        type: DataTypes.UUID,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: constants.models.TRAINER_TABLE,
          key: "id",
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
        validate: {
          isUUID: 4,
        },
      },
      customer_id: {
        type: DataTypes.UUID,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: constants.models.CUSTOMER_TABLE,
          key: "id",
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
        validate: {
          isUUID: 4,
        },
      },
    },
    { createdAt: "created_at", updatedAt: "updated_at" }
  );

  await WorkoutPlanModel.sync({ alter: true });
};

const create = async (req) => {
  return await WorkoutPlanModel.create(
    {
      plan: req.body.plan,
      trainer_id: req.user_data.id,
      customer_id: req.body.customer_id,
    },
    { returning: true, raw: true }
  );
};

const update = async (req, id) => {
  const [rowCount, rows] = await WorkoutPlanModel.update(
    {
      plan: req.body.plan,
      trainer_id: req.user_data.id,
      customer_id: req.body.customer_id,
    },
    { where: { id: req.params.id || id }, returning: true, plain: true }
  );

  return rows;
};

const getById = async (req, id) => {
  return await WorkoutPlanModel.findOne({
    where: { id: req.params.id || id },
    raw: true,
  });
};

const deleteById = async (req, id) => {
  return await WorkoutPlanModel.destroy({
    where: { id: req.params.id || id },
  });
};

const get = async (req) => {
  return await WorkoutPlanModel.findAll({});
};

export default {
  init: init,
  create: create,
  update: update,
  getById: getById,
  deleteById: deleteById,
  get: get,
};
