"use strict";
import constants from "../../lib/constants/index.js";
import sequelizeFwk, { QueryTypes } from "sequelize";
const { DataTypes, Deferrable } = sequelizeFwk;

let CustomerMembershipModel = null;

const init = async (sequelize) => {
  CustomerMembershipModel = await sequelize.define(
    constants.models.CUSTOMER_MEMBERSHIP_TABLE,
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },
      customer_id: {
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
      membership_id: {
        type: DataTypes.UUID,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: constants.models.MEMBERSHIP_TABLE,
          key: "id",
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
        validate: {
          isUUID: 4,
        },
      },
      trainer_type: {
        type: DataTypes.ENUM("general", "personal"),
        allowNull: false,
        validate: {
          isIn: [["general", "personal"]],
        },
      },
      trainer_id: {
        type: DataTypes.UUID,
        allowNull: true,
        onDelete: "SET NULL",
        references: {
          model: constants.models.TRAINER_TABLE,
          key: "id",
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
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
      discount_in_percent: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          isInt: {
            msg: "Enter valid discount!",
          },
        },
      },
      is_expired: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_freezed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  await CustomerMembershipModel.sync({ alter: true });
};

const create = async (req) => {
  return await CustomerMembershipModel.create({
    customer_id: req.body.customer_id,
    membership_id: req.body.membership_id,
    trainer_type: req.body.trainer_type,
    trainer_id: req.body.trainer_id,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    discount_in_percent: req.body.discount_in_percent,
  });
};

const update = async (req, id) => {
  return await CustomerMembershipModel.update(
    {
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      discount_in_percent: req.body.discount_in_percent,
      is_freezed: req.body.is_freezed,
    },
    { where: { id: req.params.id || id } }
  );
};

const get = async (req) => {
  let whereQuery = "";

  if (req.user_data.role === "customer") {
    whereQuery = `WHERE usr.id = '${req.user_data.id}'`;
  }

  // jsonb_path_query_first(json_agg(cusr.*)::jsonb, '$[0]') AS user,

  let query = `
  SELECT 
      cm.id,
      usr.fullname as customer_name,
      jsonb_path_query_first(
      json_agg(DISTINCT jsonb_build_object(
        'name', mbrs.name,
        'price', mbrs.price,
        'duration_in_months', mbrs.duration_in_months,
        'start_date', cm.start_date,
        'end_date', cm.end_date,
        'is_freezed', cm.is_freezed,
        'is_expired', cm.is_expired,
        'discount_in_percent', cm.discount_in_percent
      ))
      ) as membership,
      json_agg(mbrsprk.content) as perks
    FROM ${constants.models.CUSTOMER_MEMBERSHIP_TABLE} cm
    LEFT JOIN ${constants.models.CUSTOMER_TABLE} cstmr ON cstmr.id = cm.customer_id
    LEFT JOIN ${constants.models.USER_TABLE} usr ON usr.id = cstmr.user_id
    LEFT JOIN ${constants.models.MEMBERSHIP_TABLE} mbrs ON mbrs.id = cm.membership_id
    LEFT JOIN ${constants.models.MEMBERSHIP_PERKS_TABLE} mbrsprk ON mbrsprk.id = ANY(mbrs.perks)
    ${whereQuery}
    GROUP BY
      cm.id,
      usr.fullname
  `;

  return await CustomerMembershipModel.sequelize.query(query, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const getByCustomerId = async (req, id) => {
  let query = `
  SELECT 
      cm.id,
      usr.fullname as customer_name,
      json_agg(DISTINCT jsonb_build_object(
        'name', mbrs.name,
        'price', mbrs.price,
        'duration_in_months', mbrs.duration_in_months,
        'start_date', cm.start_date,
        'end_date', cm.end_date,
        'is_freezed', cm.is_freezed,
        'is_expired', cm.is_expired,
        'discount_in_percent', cm.discount_in_percent
      )) as membership,
      json_agg(mbrsprk.content) as perks,
      (
        CASE WHEN cfm.id IS NOT NULL THEN
          (json_agg(
            json_build_object(
              'id', cfm.id,
              'end_date', cfm.end_date,
              'start_date', cfm.start_date
            )
          ) -> 0)
          ELSE json_build_object()
        END
      ) as last_freeze
    FROM ${constants.models.CUSTOMER_MEMBERSHIP_TABLE} cm
    LEFT JOIN ${
      constants.models.CUSTOMER_TABLE
    } cstmr ON cstmr.id = cm.customer_id
    LEFT JOIN ${constants.models.USER_TABLE} usr ON usr.id = cstmr.user_id
    LEFT JOIN ${
      constants.models.MEMBERSHIP_TABLE
    } mbrs ON mbrs.id = cm.membership_id
    LEFT JOIN ${
      constants.models.MEMBERSHIP_PERKS_TABLE
    } mbrsprk ON mbrsprk.id = ANY(mbrs.perks)
    LEFT JOIN LATERAL (
        SELECT *
        FROM ${constants.models.CUSTOMER_FREEZE_MEMBERSHIP_TABLE} cfm
        WHERE cfm.customer_membership_id = cm.id
        ORDER BY cfm.created_at DESC
        LIMIT 1
    ) cfm ON true
    WHERE cstmr.id = '${req.params.id || id}'
    GROUP BY
      cm.id,
      usr.fullname,
      cfm.id
  `;

  return await CustomerMembershipModel.sequelize.query(query, {
    type: QueryTypes.SELECT,
    raw: true,
  });
};

const getById = async (req, id) => {
  return await CustomerMembershipModel.findOne({
    where: {
      id: req?.params?.id || id,
    },
    raw: true,
  });
};

const deleteById = async (req, id) => {
  return await CustomerMembershipModel.destroy({
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
  getByCustomerId: getByCustomerId,
};
