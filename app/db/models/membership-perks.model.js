"use strict";
import constants from "../../lib/constants/index.js";
import sequelizeFwk from "sequelize";
const { DataTypes } = sequelizeFwk;

let MembershipPerksModel = null;

const init = async (sequelize) => {
  MembershipPerksModel = sequelize.define(
    constants.models.MEMBERSHIP_PERKS_TABLE,
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: "Content is required!",
          notEmpty: "Content is required!",
        },
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  await MembershipPerksModel.sync({ alter: true });
};

const create = async (req) => {
  return await MembershipPerksModel.create({
    content: req.body.content,
  });
};

const get = async (req) => {
  return await MembershipPerksModel.findAll({
    order: [["created_at", "DESC"]],
  });
};

const getById = async (req, id) => {
  return await MembershipPerksModel.findOne({
    where: {
      id: req.params.id || id,
    },
    raw: true,
  });
};

const getByContent = async (req, content) => {
  return await MembershipPerksModel.findOne({
    where: {
      content: req.body.content || content,
    },
    raw: true,
  });
};

const deleteById = async (req, id) => {
  return await MembershipPerksModel.destroy({
    where: { id: req.params.id || id },
  });
};

const updateById = async (req, id) => {
  return await MembershipPerksModel.update(
    {
      content: req.body.content,
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
  getByContent: getByContent,
  deleteById: deleteById,
  updateById: updateById,
};
