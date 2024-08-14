"use strict";
import constants from "../../lib/constants/index.js";
import sequelizeFwk, { QueryTypes } from "sequelize";
const { DataTypes, Deferrable } = sequelizeFwk;

let OffersModel = null;

const init = async (sequelize) => {
  OffersModel = sequelize.define(
    constants.models.OFFER_TABLE,
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
          notEmpty: { msg: "Title is required*" },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Description is required*" },
        },
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      coupon_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  await OffersModel.sync({ alter: true });
};

const create = async (req) => {
  return await OffersModel.create({
    title: req.body.title,
    description: req.body.description,
    image: req.body.image,
    coupon_code: req.body.coupon_code,
  });
};

const update = async (req, id) => {
  return await OffersModel.update(
    {
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      coupon_code: req.body.coupon_code,
    },
    { where: { id: req.params.id || id } }
  );
};

const get = async (req) => {
  return await OffersModel.findAll({});
};

const getById = async (req, id) => {
  return await OffersModel.findOne({
    where: {
      id: req.params.id || id,
    },
  });
};

const deleteById = async (req, id) => {
  return await OffersModel.destroy({
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
