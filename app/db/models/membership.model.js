"use strict";
import constants from "../../lib/constants/index.js";
import sequelizeFwk, { QueryTypes } from "sequelize";
const { DataTypes } = sequelizeFwk;

let MembershipModel = null;

const init = async (sequelize) => {
  MembershipModel = sequelize.define(
    constants.models.MEMBERSHIP_TABLE,
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

  await MembershipModel.sync({ alter: true });
};

const create = async (req) => {
  return await MembershipModel.create({
    name: req.body.name,
    slug: req.body.slug,
    duration_in_months: req.body.duration_in_months,
    price: req.body.price,
    perks: req.body.perks,
  });
};

const get = async (req) => {
  let query = `
  SELECT
      mbrs.id,
      mbrs.name,
      mbrs.price,
      mbrs.duration_in_months,
      mbrs.created_at,
      json_agg(mbrsprk.content) as perks
    FROM ${constants.models.MEMBERSHIP_TABLE} mbrs
    LEFT JOIN ${constants.models.MEMBERSHIP_PERKS_TABLE} mbrsprk ON mbrsprk.id = ANY(mbrs.perks)
    GROUP BY
      mbrs.id
  `;

  return await MembershipModel.sequelize.query(query, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const getById = async (req, id) => {
  return await MembershipModel.findOne({
    where: {
      id: req?.params?.id || id,
    },
    raw: true,
  });
};

const deleteById = async (req, id) => {
  return await MembershipModel.destroy({
    where: { id: req.params.id || id },
  });
};

const updateById = async (req, id) => {
  return await MembershipModel.update(
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

const verify = async ({ id, status }) => {
  const [rowCount, rows] = await MembershipModel.update(
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
  get: get,
  getById: getById,
  deleteById: deleteById,
  updateById: updateById,
  verify: verify,
};
