"use strict";
import constants from "../../lib/constants/index.js";
import sequelizeFwk, { QueryTypes } from "sequelize";
const { DataTypes, Deferrable } = sequelizeFwk;

let CustomerFreezeMembershipModel = null;

const init = async (sequelize) => {
  CustomerFreezeMembershipModel = await sequelize.define(
    constants.models.CUSTOMER_FREEZE_MEMBERSHIP_TABLE,
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      customer_membership_id: {
        type: DataTypes.UUID,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: constants.models.CUSTOMER_MEMBERSHIP_TABLE,
          key: "id",
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
        validate: {
          isUUID: 4,
        },
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: { msg: "Please enter valid date!" },
        },
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: { msg: "Please enter valid date!" },
        },
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  await CustomerFreezeMembershipModel.sync({ alter: true });
};

const create = async (req) => {
  return await CustomerFreezeMembershipModel.create({
    customer_membership_id: req.params.id,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
  });
};

const update = async (req, id) => {
  const [rowCount, rows] = await CustomerFreezeMembershipModel.update(
    {
      customer_membership_id: req.body.customer_membership_id,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
    },
    {
      where: { id: req.params.id || id },
      returning: true,
      plain: true,
      raw: true,
    }
  );
  return rows;
};

const get = async (req) => {
  return await CustomerFreezeMembershipModel.findAll({});
};

const getById = async (req, id) => {
  return await CustomerFreezeMembershipModel.findOne({
    where: {
      id: req.params.id || id,
    },
  });
};

const getLastFreezed = async (id) => {
  return await CustomerFreezeMembershipModel.findOne({
    where: {
      customer_membership_id: id,
    },
    order: [["created_at", "DESC"]],
    raw: true,
  });
};

const deleteById = async (req, id) => {
  return await CustomerFreezeMembershipModel.destroy({
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
  getLastFreezed: getLastFreezed,
};
