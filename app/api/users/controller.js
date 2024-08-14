"use strict";

import table from "../../db/models.js";
import hash from "../../lib/encryption/index.js";
import ejs from "ejs";
import fs from "fs";
import path from "path";
import { sendCredentials } from "../../helpers/mailer.js";
import { fileURLToPath } from "url";
import { ErrorHandler } from "../../helpers/handleError.js";

const create = async (req, res) => {
  try {
    const record = await table.UserModel.getByUsername(req);

    if (record) {
      return ErrorHandler({
        code: 409,
        message:
          "User already exists with username. Please try with different username",
      });
    }

    const newUser = await table.UserModel.create(req);

    if (newUser) {
      req.body.user_id = newUser.id;
    } else {
      return ErrorHandler({ code: 500, message: "Error creating user!" });
    }

    if (newUser.role === "sales_person") {
      await table.SalesPersonModel.create(req);
    }

    if (newUser.role === "customer") {
      await table.CustomerModel.create(req);
    }

    if (newUser.role === "trainer") {
      // ! need trainer_type in body
      await table.TrainerModel.create(req);
    }
    res.send({ message: "User created" });
  } catch (error) {
    ErrorHandler({ code: 500, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const record = await table.UserModel.getById(req);
    if (!record) {
      return ErrorHandler({ code: 404, message: "User not exists" });
    }

    const user = await table.UserModel.update(req);

    if (user && req.body.password) {
      req.body.new_password = req.body.password;
      await table.UserModel.updatePassword(req, req.user_data.id);
    }
    return res.send({ status: true, message: "Updated" });
  } catch (error) {
    ErrorHandler({ code: 500, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const record = await table.UserModel.getById(req);
    if (!record) {
      return ErrorHandler({ code: 404, message: "User not exists" });
    }
    const data = await table.UserModel.updateStatus(
      req.params.id,
      req.body.is_active
    );

    if (data.is_active) {
      // Read the email template file
      const emailTemplatePath = path.join(
        fileURLToPath(import.meta.url),
        "..",
        "..",
        "..",
        "..",
        "views",
        "credentials.ejs"
      );
      const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");

      // Render the email template with user data
      const template = ejs.render(emailTemplate, {
        fullname: `${data.first_name} ${data.last_name}`,
        username: data.username,
        password: 1234,
      });

      await sendCredentials(template, data?.email);
    }

    res.send({
      status: true,
      message: data?.is_active ? "Customer Active." : "Customer Inactive.",
    });
  } catch (error) {
    ErrorHandler({ code: 500, message: error.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const record = await table.UserModel.deleteById(req);
    if (record === 0) {
      return ErrorHandler({ code: 404, message: "User not exists" });
    }

    return res.send({ status: true, data: record });
  } catch (error) {
    ErrorHandler({ code: 500, message: error.message });
  }
};

const get = async (req, res) => {
  try {
    return res.send(await table.UserModel.get(req));
  } catch (error) {
    ErrorHandler({ code: 500, message: error.message });
  }
};

const getTrainers = async (req, res) => {
  try {
    return res.send({
      status: true,
      data: await table.UserModel.getTrainers(req),
    });
  } catch (error) {
    ErrorHandler({ code: 500, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const record = await table.UserModel.getById(req);
    if (!record) {
      return ErrorHandler({ code: 404, message: "User not exists" });
    }
    delete record.password;

    return res.send({ status: true, data: record });
  } catch (error) {
    ErrorHandler({ code: 500, message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const record = await table.UserModel.getById(req);

    if (!record) {
      return ErrorHandler({ code: 404, message: "User not exists" });
    }

    const verify_old_password = await hash.verify(
      req.body.old_password,
      record.password
    );

    if (!verify_old_password) {
      return ErrorHandler({
        code: 400,
        message: "Incorrect password. Please enter a valid password",
      });
    }

    await table.UserModel.updatePassword(req);
    return res.send({
      status: true,
      message: "Password changed successfully!",
    });
  } catch (error) {
    ErrorHandler({ code: 500, message: error.message });
  }
};

const checkUsername = async (req, res) => {
  try {
    const user = await table.UserModel.getByUsername(req);
    if (user) {
      return ErrorHandler({
        code: 409,
        message: "username already exists try with different username",
      });
    }
    return res.send({ status: true });
  } catch (error) {
    ErrorHandler({ code: 500, message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const record = await table.UserModel.getById(undefined, req.user_data.id);
    if (!record) {
      return res.code(401).send({ status: false, messaege: "invalid token" });
    }

    return res.send(req.user_data);
  } catch (error) {
    ErrorHandler({ code: 500, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const token = await table.UserModel.getByResetToken(req);
    if (!token) {
      return res.code(401).send({ status: false, message: "invalid url" });
    }

    await table.UserModel.updatePassword(req, token.id);
    return res.send({
      status: true,
      message: "Password reset successfully!",
    });
  } catch (error) {
    ErrorHandler({ code: 500, message: error.message });
  }
};
export default {
  create: create,
  update: update,
  deleteById: deleteById,
  get: get,
  getById: getById,
  checkUsername: checkUsername,
  updatePassword: updatePassword,
  getUser: getUser,
  resetPassword: resetPassword,
  updateStatus: updateStatus,
  getTrainers: getTrainers,
};
