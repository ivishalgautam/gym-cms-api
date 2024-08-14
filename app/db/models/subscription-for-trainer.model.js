"use strict";
import constants from "../../lib/constants/index.js";
import sequelizeFwk from "sequelize";
const { DataTypes } = sequelizeFwk;

let SubsscriptionForTrainerModel = null;

const init = async (sequelize) => {
  SubsscriptionForTrainerModel = sequelize.define(
    constants.models.SUBSCRIPTION_FOR_TRAINER_TABLE,
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: "Name is required!",
        },
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: "Slug is required!",
        },
      },
      duration_in_months: {
        type: DataTypes.INTEGER,
        allowNull: false,
        notEmpty: "Duration is required!",
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
          isInt: true,
        },
      },
      perks: { type: DataTypes.ARRAY(DataTypes.UUID) },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  await SubsscriptionForTrainerModel.sync({ alter: true });
};

const create = async (req) => {
  return await SubsscriptionForTrainerModel.create({
    name: req.body.name,
    slug: req.body.slug,
    duration_in_months: req.body.duration_in_months,
    price: req.body.price,
  });
};

const get = async (req) => {
  return await SubsscriptionForTrainerModel.findAll({
    order: [["created_at", "DESC"]],
  });
};

const getById = async (req, id) => {
  return await SubsscriptionForTrainerModel.findOne({
    where: {
      id: req.params.id || id,
    },
  });
};

const deleteById = async (req, id) => {
  return await SubsscriptionForTrainerModel.destroy({
    where: { id: req.params.id || id },
  });
};

const updateById = async (req, id) => {
  return await SubsscriptionForTrainerModel.update(
    {
      name: req.body.name,
      slug: req.body.slug,
      duration_in_months: req.body.duration_in_months,
      price: req.body.price,
    },
    {
      where: { id: req.params.id || id },
    }
  );
};

export default {
  init: init,
  create: create,
  get: get,
  getById: getById,
  deleteById: deleteById,
  updateById: updateById,
};
