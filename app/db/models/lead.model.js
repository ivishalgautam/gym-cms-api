"use strict";
import constants from "../../lib/constants/index.js";
import sequelizeFwk from "sequelize";
const { DataTypes, Deferrable } = sequelizeFwk;

let LeadModel = null;

const init = async (sequelize) => {
  LeadModel = sequelize.define(
    constants.models.LEAD_TABLE,
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      fullname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: "Fullname is required!",
          notEmpty: "Fullname is required!",
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: { msg: "Please enter valid email!" },
          notNull: { msg: "Email is required!" },
          notEmpty: { msg: "Email is required!" },
        },
      },
      mobile_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Mobile number is required!" },
          notEmpty: { msg: "Mobile number is required!" },
        },
      },
      source: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Source is required!" },
          notEmpty: { msg: "Source is required!" },
        },
      },
      sales_person_id: {
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
      is_converted_to_member: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Location is required!" },
          notEmpty: { msg: "Location is required!" },
        },
      },
      is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
      avatar: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  await LeadModel.sync({ alter: true });
};

const create = async (req) => {
  return await LeadModel.create({
    fullname: req.body.fullname,
    email: req.body.email,
    mobile_number: req.body.mobile_number,
    source: req.body.source,
    sales_person_id: req.body.sales_person_id,
    location: req.body.location,
  });
};

const update = async (req, id) => {
  return await LeadModel.update(
    {
      fullname: req.body.fullname,
      email: req.body.email,
      mobile_number: req.body.mobile_number,
      source: req.body.source,
      sales_person_id: req.body.sales_person_id,
      location: req.body.location,
      is_converted_to_member: req.body.is_converted_to_member,
    },
    { where: { id: req.params.id || id } }
  );
};

const get = async (req) => {
  return await LeadModel.findAll({
    order: [["created_at", "DESC"]],
  });
};

const getById = async (req, id) => {
  return await LeadModel.findOne({
    where: {
      id: req.params.id || id,
    },
    raw: true,
  });
};

const deleteById = async (req, id) => {
  return await LeadModel.destroy({
    where: { id: req.params.id || id },
  });
};

const verify = async ({ id, status }) => {
  const [rowCount, rows] = await LeadModel.update(
    {
      is_verified: status,
    },
    {
      where: {
        id: id,
      },
      plain: true,
      raw: true,
    }
  );

  return rows;
};

export default {
  init: init,
  create: create,
  update: update,
  get: get,
  getById: getById,
  deleteById: deleteById,
  verify: verify,
};
