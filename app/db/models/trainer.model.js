"use strict";
import constants from "../../lib/constants/index.js";
import sequelizeFwk, { QueryTypes } from "sequelize";
const { DataTypes, Deferrable } = sequelizeFwk;

let TrainerModel = null;

const init = async (sequelize) => {
  TrainerModel = await sequelize.define(
    constants.models.TRAINER_TABLE,
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
      type: {
        type: DataTypes.ENUM("personal", "general"),
        defaultValue: "general",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "",
        // validate: {
        //   notNull: { msg: "Description is required!" },
        // },
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  await TrainerModel.sync({ alter: true });
};

const create = async (req) => {
  return await TrainerModel.create({
    user_id: req.body.user_id,
    type: req.body.trainer_type,
  });
};

const update = async (req, id) => {
  return await TrainerModel.update(
    {
      user_id: req.body.user_id,
      type: req.body.type,
    },
    { where: { id: req.params.id || id } }
  );
};

const get = async (req) => {
  let whereQuery = "";
  const type = req.query.type;
  if (type) {
    whereQuery = `WHERE trnr.type = '${type}'`;
  }

  let query = `
  SELECT
      trnr.id,
      trnr.type,
      usr.id as user_id,
      usr.fullname,
      usr.avatar
    FROM ${constants.models.TRAINER_TABLE} trnr
    LEFT JOIN ${constants.models.USER_TABLE} usr ON usr.id = trnr.user_id
    ${whereQuery}
  `;
  return await TrainerModel.sequelize.query(query, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const getById = async (req, id) => {
  return await TrainerModel.findOne({
    where: {
      id: req?.params?.id || id,
    },
  });
};

const deleteById = async (req, id) => {
  return await TrainerModel.destroy({
    where: { id: req.params.id || id },
  });
};

export default {
  init: init,
  create: create,
  get: get,
  getById: getById,
  deleteById: deleteById,
  update: update,
};
