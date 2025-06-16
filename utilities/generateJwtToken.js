import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_VOUCHER_SECRET || "VOUCHER_SECRET_KEY";
export const generateVoucherToken = (data) => {
  return jwt.sign(
    data,
    JWT_SECRET,
    { expiresIn: "10m" }
  );
};
