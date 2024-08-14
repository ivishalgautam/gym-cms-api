"use strict";
import constants from "../../lib/constants/index.js";
import table from "../../db/models.js";
import { ErrorHandler } from "../../helpers/handleError.js";
import moment from "moment";

const { NOT_FOUND } = constants.http.status;

const getById = async (req, res) => {
  const record = await table.CustomerFreezeMembershipModel.getById(req);

  if (!record) {
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Freeze time period not found!",
    });
  }

  res.send({ status: true, data: record });
};

const update = async (req, res) => {
  const record = await table.CustomerFreezeMembershipModel.getById(req);

  if (!record) {
    return ErrorHandler({
      code: NOT_FOUND,
      message: "Freeze time period not found!!",
    });
  }

  const customerMembership = await table.CustomerMembershipModel.getById(
    0,
    record.customer_membership_id
  );

  if (moment(req.body.end_date).isBefore(record.start_date)) {
    return ErrorHandler({ code: 400, message: "Time period not started yet!" });
  }

  const updated = await table.CustomerFreezeMembershipModel.update(req);
  if (moment(updated.end_date).isSameOrBefore(moment())) {
    console.log({ customerMembership });
    const diff = moment(updated.end_date).diff(updated.start_date, "days");
    const newEndDate = moment(customerMembership.end_date).add(diff, "days");

    console.log({ diff, newEndDate });
    await table.CustomerMembershipModel.update({
      params: { id: updated.customer_membership_id },
      body: { end_date: newEndDate },
    });
  }

  res.send({ status: true, message: "Updated." });
};

export default {
  getById: getById,
  update: update,
};
