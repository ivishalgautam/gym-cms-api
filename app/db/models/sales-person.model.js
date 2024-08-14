"use strict";
import constants from "../../lib/constants/index.js";
import sequelizeFwk from "sequelize";
const { DataTypes, Deferrable } = sequelizeFwk;

let SalesPersonModel = null;

const init = async (sequelize) => {
  SalesPersonModel = await sequelize.define(
    constants.models.SALES_PERSON_TABLE,
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
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  await SalesPersonModel.sync({ alter: true });
};

const create = async (req) => {
  return await SalesPersonModel.create({
    user_id: req.body.user_id,
  });
};

const get = async (req) => {
  return await SalesPersonModel.findAll({
    order: [["created_at", "DESC"]],
  });
};

const getById = async (req, id) => {
  return await SalesPersonModel.findOne({
    where: {
      id: req?.params?.id || id,
    },
  });
};

const getByUserId = async (req, user_id) => {
  return await SalesPersonModel.findOne({
    where: {
      user_id: req?.params?.id || user_id,
    },
  });
};

const deleteById = async (req, id) => {
  return await SalesPersonModel.destroy({
    where: { id: req.params.id || id },
  });
};

export default {
  init: init,
  create: create,
  get: get,
  getById: getById,
  getByUserId: getByUserId,
  deleteById: deleteById,
};
