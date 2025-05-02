import User from "../models/User.js";
import sendEmail from "./EmailController.js";

const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide email",
            });
        }

        const user = await User.findOne({
            email,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        console.log("req body : ", req.body);

        const sendEmailResponse = await sendEmail(
            process.env.email,
            email,
            "OTP for email verification",
            `Your OTP to verify your account is ${otp}`
        );

        if (!sendEmailResponse.status) {
            return res.status(500).json({
                success: false,
                message: "Server error",
            });
        }

        console.log("otp : ", otp);
        await User.updateOne(
            {
                email,
            },
            {
                $set: {
                    otp,
                    otpExpires: Date.now() + 10 * 60 * 1000,
                },
            }
        );

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });
    } catch (error) {
        console.log("error : ", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const veryfyEmail = async (req, res, next) => {
    try {
        console.log("verify email : ", req.body);
        const { email, otp } = req.body;
        const foundUser = await User.findOne({ email: email });

        if (!foundUser)
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Invalid username or password",
                });

        if (foundUser.isVerified)
            return res
                .status(200)
                .json({ success: true, message: "Email is already verified" });

        if (foundUser.otp !== Number(otp))
            return res
                .status(400)
                .json({ success: false, message: "Invalid OTP" });

        if (foundUser.otpExpires < Date.now()) {
            await User.updateOne(
                { email: email },
                {
                    $unset: {
                        otp: 1,
                        otpExpires: 1,
                    },
                }
            );
            return res
                .status(400)
                .json({ success: false, message: "OTP has been expired" });
        }

        await User.updateOne(
            { email: email },
            {
                $set: {
                    isAccountVerified: true,
                },
                $unset: {
                    otp: 1,
                    otpExpires: 1,
                },
            }
        );
        res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        next(error);
    }
};

export { sendOTP, veryfyEmail };
