"use strict";
import constants from "../../lib/constants/index.js";
import sequelizeFwk, { QueryTypes } from "sequelize";
const { DataTypes, Deferrable } = sequelizeFwk;

let CustomerModel = null;

const init = async (sequelize) => {
  CustomerModel = await sequelize.define(
    constants.models.CUSTOMER_TABLE,
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
      docs: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: [],
      },
      sales_person_id: {
        type: DataTypes.UUID,
        allowNull: false,
        onDelete: "SET NULL",
        references: {
          model: constants.models.SALES_PERSON_TABLE,
          key: "id",
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  await CustomerModel.sync({ alter: true });
};

const create = async (req) => {
  return await CustomerModel.create({
    user_id: req.body.user_id,
  });
};

const get = async (req) => {
  let whereQuery = "";

  if (req.user_data.role === "sales_person") {
    whereQuery = `WHERE susr.id = '${req.user_data.id}'`;
  }

  // jsonb_path_query_first(json_agg(cusr.*)::jsonb, '$[0]') AS user,
  let query = `
    SELECT 
      cstmr.*,
      cusr.id as customer_user_id,
      cusr.username as customer_username
    FROM ${constants.models.CUSTOMER_TABLE} cstmr
    LEFT JOIN ${constants.models.SALES_PERSON_TABLE} sp ON sp.id = cstmr.sales_person_id
    LEFT JOIN ${constants.models.USER_TABLE} susr ON susr.id = sp.user_id
    LEFT JOIN ${constants.models.USER_TABLE} cusr ON cusr.id = cstmr.user_id
    ${whereQuery}
    GROUP BY
      cstmr.id,
      cusr.id,
      cusr.username
    ORDER BY cstmr.created_at DESC
  `;

  console.log(query);
  return await CustomerModel.sequelize.query(query, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const getById = async (req, id) => {
  return await CustomerModel.findOne({
    where: {
      id: req.params.id || id,
    },
  });
};

const deleteById = async (req, id) => {
  return await CustomerModel.destroy({
    where: { id: req.params.id || id },
  });
};

export default {
  init: init,
  create: create,
  get: get,
  getById: getById,
  deleteById: deleteById,
};
