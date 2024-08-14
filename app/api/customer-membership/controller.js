"use strict";
import constants from "../../lib/constants/index.js";
import table from "../../db/models.js";
import { ErrorHandler } from "../../helpers/handleError.js";
import moment from "moment";

const { NOT_FOUND } = constants.http.status;

const create = async (req, res) => {
  await table.CustomerMembershipModel.create(req);
  res.send({ status: true, message: "Customer membership created." });
};

const getById = async (req, res) => {
  const record = await table.CustomerMembershipModel.getById(req);

  if (!record) {
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Customer membership not found!",
    });
  }

  res.send({ status: true, data: record });
};

const update = async (req, res) => {
  const record = await table.CustomerMembershipModel.getById(req);
  if (!record)
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Customer membership not found!",
    });

  await table.CustomerMembershipModel.update(req);
};

const transferMembership = async (req, res) => {
  const record = await table.CustomerMembershipModel.getById(req);
  if (!record)
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Customer membership not found!",
    });

  const userRecord = await table.UserModel.getById(0, req.body.user_id);
  if (!userRecord)
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Customer not exist, you transfering membership to!",
    });

  await table.CustomerMembershipModel.update(req);
};

const get = async (req, res) => {
  const queries = await table.CustomerMembershipModel.get(req);
  res.send({ status: true, data: queries });
};

const getByCustomerId = async (req, res) => {
  const record = await table.CustomerModel.getById(req);
  if (!record)
    return ErrorHandler({ code: 404, message: "Customer not found!" });

  const data = await table.CustomerMembershipModel.getByCustomerId(req);
  res.send({ status: true, data: data });
};

const deleteById = async (req, res) => {
  const record = await table.CustomerMembershipModel.getById(req);

  if (!record)
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Customer membership not found!",
    });

  await table.CustomerMembershipModel.deleteById(req);
  res.send({ status: true, message: "Customer membership deleted." });
};

const freezeMembership = async (req, res) => {
  const lastFreezed = await table.CustomerFreezeMembershipModel.getLastFreezed(
    req.params.id
  );

  if (lastFreezed && moment(lastFreezed.end_date) > moment()) {
    return ErrorHandler({
      code: 400,
      message: "Only one freeze period allowed!",
    });
  }

  if (lastFreezed) {
    const startDate = moment(req.body.start_date);
    const endDate = moment(req.body.end_date);

    const freezePeriodExist =
      endDate.isSameOrBefore(lastFreezed.start_date) &&
      startDate.isSameOrAfter(lastFreezed.start_date);

    if (freezePeriodExist)
      return ErrorHandler({
        code: 400,
        message: "The selected period overlaps with an existing freeze period.",
      });
  }

  const isSameDate = moment(req.body.start_date).isSame(moment(), "date");
  const record = await table.CustomerMembershipModel.getById(req);

  if (!record)
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Membership not found!",
    });

  if (isSameDate) {
    await table.CustomerMembershipModel.update({
      ...req,
      body: { is_freezed: true },
    });
  }

  // create a table where freezed memberships will store with customer_membership_id
  await table.CustomerFreezeMembershipModel.create(req);

  res.send({ status: true, message: "Membership freezed." });
};

export default {
  create: create,
  get: get,
  deleteById: deleteById,
  getById: getById,
  freezeMembership: freezeMembership,
  update: update,
  transferMembership: transferMembership,
  getByCustomerId: getByCustomerId,
};
