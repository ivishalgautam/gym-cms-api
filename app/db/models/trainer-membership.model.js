"use strict";
import constants from "../../lib/constants/index.js";
import sequelizeFwk, { QueryTypes } from "sequelize";
const { DataTypes, Deferrable } = sequelizeFwk;

let TrainerMembershipModel = null;

const init = async (sequelize) => {
  TrainerMembershipModel = await sequelize.define(
    constants.models.TRAINER_MEMBERSHIP_TABLE,
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      trainer_id: {
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
      subscription_id: {
        type: DataTypes.UUID,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: constants.models.SUBSCRIPTION_FOR_TRAINER_TABLE,
          key: "id",
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
        validate: {
          isUUID: 4,
        },
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
      is_expired: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  await TrainerMembershipModel.sync({ alter: true });
};

const create = async (req) => {
  return await TrainerMembershipModel.create({
    subscription_id: req.body.subscription_id,
    trainer_id: req.body.trainer_id,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
  });
};

const update = async (req, id) => {
  return await TrainerMembershipModel.update(
    {
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      discount_in_percent: req.body.discount_in_percent,
      is_expired: req.body.is_expired,
    },
    { where: { id: req.params.id || id } }
  );
};

const get = async (req) => {
  let whereQuery = "";

  if (req.user_data.role === "trainer") {
    whereQuery = `WHERE tm.user_id = '${req.user_data.id}'`;
  }

  let query = `
  SELECT 
      tm.*,
      usr.fullname as customer_name,
      s.name as subscription_name
    FROM ${constants.models.TRAINER_MEMBERSHIP_TABLE} tm
    LEFT JOIN ${constants.models.USER_TABLE} usr ON usr.id = tm.user_id
    LEFT JOIN ${constants.models.SUBSCRIPTION_FOR_TRAINER_TABLE} ts ON ts.id = tm.subscription_id
    ${whereQuery}
  `;

  return await TrainerMembershipModel.sequelize.query(query, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const getById = async (req, id) => {
  return await TrainerMembershipModel.findOne({
    where: {
      id: req.params.id || id,
    },
  });
};

const deleteById = async (req, id) => {
  return await TrainerMembershipModel.destroy({
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
