"use strict";
import constants from "../../lib/constants/index.js";
import hash from "../../lib/encryption/index.js";
import sequelizeFwk from "sequelize";
import { Op } from "sequelize";
import moment from "moment";

let UserModel = null;

const init = async (sequelize) => {
  UserModel = sequelize.define(
    constants.models.USER_TABLE,
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: sequelizeFwk.DataTypes.UUID,
        defaultValue: sequelizeFwk.DataTypes.UUIDV4,
      },
      username: {
        type: sequelizeFwk.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: { msg: "Username is required!" },
        },
      },
      email: {
        type: sequelizeFwk.DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      mobile_number: {
        type: sequelizeFwk.DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Mobile number is required!" },
        },
      },
      fullname: {
        type: sequelizeFwk.DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Fullname is required!" },
        },
      },
      password: {
        type: sequelizeFwk.DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Password is required!" },
        },
      },
      is_active: {
        type: sequelizeFwk.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      role: {
        type: sequelizeFwk.DataTypes.ENUM(
          "admin",
          "sales_person",
          "trainer",
          "customer"
        ),
        defaultValue: "customer",
      },
      avatar: {
        type: sequelizeFwk.DataTypes.TEXT,
        allowNull: true,
      },
      reset_password_token: {
        type: sequelizeFwk.DataTypes.STRING,
      },
      confirmation_token: {
        type: sequelizeFwk.DataTypes.STRING,
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  await UserModel.sync({ alter: true });
};

const create = async (req) => {
  const hash_password = hash.encrypt(req.body.password);
  return await UserModel.create(
    {
      username: req.body.username,
      password: hash_password,
      fullname: req.body?.fullname,
      email: req.body?.email,
      mobile_number: req.body?.mobile_number,
      role: req.body?.role,
      avatar: req.body?.avatar,
    },
    { returning: true, raw: true }
  );
};

const get = async (req) => {
  const role = req.query?.role;

  return await UserModel.findAll({
    where: {
      id: {
        [Op.ne]: req.user_data.id,
      },
      role: {
        [Op.ne]: "admin",
      },
    },
    order: [["created_at", "DESC"]],
    attributes: {
      exclude: ["password", "reset_password_token", "confirmation_token"],
    },
  });
};

const getTrainers = async (req) => {
  return await UserModel.findAll({
    where: {
      role: "trainer",
    },
    order: [["created_at", "DESC"]],
    attributes: ["id", "fullname"],
  });
};

const getById = async (req, user_id) => {
  return await UserModel.findOne({
    where: {
      id: req?.params?.id || user_id,
    },
    raw: true,
    attributes: [
      "id",
      "username",
      "email",
      "fullname",
      "password",
      "is_active",
      "role",
      "mobile_number",
      "avatar",
    ],
  });
};

const getByUsername = async (req, record = undefined) => {
  return await UserModel.findOne({
    where: {
      username: req?.body?.username || record?.user?.username,
    },
    attributes: [
      "id",
      "username",
      "email",
      "fullname",
      "password",
      "is_active",
      "role",
      "mobile_number",
      "avatar",
    ],
  });
};

const update = async (req) => {
  return await UserModel.update(
    {
      username: req.body?.username,
      fullname: req.body?.fullname,
      email: req.body?.email,
      mobile_number: req.body?.mobile_number,
      role: req.body?.role,
      avatar: req.body?.avatar,
    },
    {
      where: {
        id: req.params.id,
      },
      returning: [
        "id",
        "username",
        "email",
        "fullname",
        "is_active",
        "role",
        "mobile_number",
        "avatar",
      ],
      plain: true,
    }
  );
};

const updatePassword = async (req, user_id) => {
  const hash_password = hash.encrypt(req.body.new_password);
  return await UserModel.update(
    {
      password: hash_password,
    },
    {
      where: {
        id: req.params?.id || user_id,
      },
    }
  );
};

const deleteById = async (req, user_id) => {
  return await UserModel.destroy({
    where: {
      id: req?.params?.id || user_id,
    },
    returning: true,
    raw: true,
  });
};

const countUser = async (last_30_days = false) => {
  let where_query;
  if (last_30_days) {
    where_query = {
      createdAt: {
        [Op.gte]: moment()
          .subtract(30, "days")
          .format("YYYY-MM-DD HH:mm:ss.SSSZ"),
      },
    };
  }
  return await UserModel.findAll({
    where: where_query,
    attributes: [
      "role",
      [
        UserModel.sequelize.fn("COUNT", UserModel.sequelize.col("role")),
        "total",
      ],
    ],
    group: "role",
    raw: true,
  });
};

const getByEmailId = async (req) => {
  return await UserModel.findOne({
    where: {
      email: req.body.email,
    },
  });
};

const getByResetToken = async (req) => {
  return await UserModel.findOne({
    where: {
      reset_password_token: req.params.token,
    },
  });
};

const getByUserIds = async (user_ids) => {
  return await UserModel.findAll({
    where: {
      id: {
        [Op.in]: user_ids,
      },
    },
  });
};

const updateStatus = async (id, status) => {
  const [rowCount, rows] = await UserModel.update(
    {
      is_active: status,
    },
    {
      where: {
        id: id,
      },
      returning: [
        "id",
        "username",
        "email",
        "fullname",
        "is_active",
        "role",
        "mobile_number",
        "avatar",
      ],
      plain: true,
      raw: true,
    }
  );

  return rows;
};

const findUsersWithBirthdayToday = async () => {
  const startIST = moment().startOf("day").toDate();
  const endIST = moment().endOf("day").toDate();

  try {
    const usersWithBirthdayToday = await UserModel.findAll({
      where: {
        birth_date: {
          [Op.between]: [startIST, endIST],
        },
        role: {
          [Op.in]: ["customer"],
        },
      },
    });

    return usersWithBirthdayToday;
  } catch (error) {
    console.error("Error finding users with birthday today:", error);
    throw error;
  }
};

export default {
  init: init,
  create: create,
  get: get,
  getById: getById,
  getByUsername: getByUsername,
  update: update,
  updatePassword: updatePassword,
  deleteById: deleteById,
  countUser: countUser,
  getByEmailId: getByEmailId,
  getByResetToken: getByResetToken,
  getByUserIds: getByUserIds,
  findUsersWithBirthdayToday: findUsersWithBirthdayToday,
  updateStatus: updateStatus,
  getTrainers: getTrainers,
};
