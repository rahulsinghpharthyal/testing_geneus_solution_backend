import User from "../../models/User.js";
import ApiError from "../../utilities/ApiError.js";

export const findUsersByEmailsOrFail = async (emails = []) => {
  if (!Array.isArray(emails) || emails.length === 0) {
    throw new ApiError(400, "No user emails provided");
  }

  const users = await User.find({ email: { $in: emails } }, "_id email");
  const foundEmails = users.map(u => u.email);
  const missingEmails = emails.filter(e => !foundEmails.includes(e));

  if (missingEmails.length > 0) {
    throw new ApiError(404, `Users not found for emails: ${missingEmails.join(", ")}`);
  }

  return users;
};