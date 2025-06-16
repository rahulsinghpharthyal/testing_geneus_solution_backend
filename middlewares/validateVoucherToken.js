import jwt from "jsonwebtoken";
import ApiError from "../utilities/ApiError.js";

const JWT_SECRET = process.env.JWT_VOUCHER_SECRET || "VOUCHER_SECRET_KEY";

export const validateVoucherToken = (req, res, next) => {
  const token = req.headers["x-voucher-token"];
  if (!token) {
    return next(); // allow without voucher
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.voucher = decoded; // attach validated voucher info
    next();
  } catch (err) {
    throw new ApiError(401, "Invalid or expired voucher token");
  }
};
