import shortid from "shortid";
import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import sendEmail from "./EmailController.js";
import { configDotenv } from "dotenv";

import eventBus from "../utilities/createEvent.js";
import '../services/courses/purchaseCourse.js';

configDotenv();

const getPaymentKey = async (req, res) => {
  try {
      return res.status(200).json({
          key_id: process.env.RAZORPAY_ID,
      })
  } catch (error) {
      return res.status(500).json({
          message: 'Something went wrong',
      })
  }
}

const postRazorpay = async (req, res) => {
  console.log('this is postRazorpay body', req.body)
  try {
    const getExistingCourse = await User.findOne({email: req.body.email}).select('courses');

    console.log(getExistingCourse, 'this is getExistingCourse')

    if(getExistingCourse?.courses?.length > 0) {

      const existingCourse = getExistingCourse.courses;
      const cartDetails = req.body.cart_details;

      const isCourseAlreadyEnrolled = existingCourse.some((course) => {
        return cartDetails.includes(course);
      });

      if (isCourseAlreadyEnrolled) {  
        return res.status(409).json({ error: "You have already enrolled for this course" });        
      }
    }

    const payment_capture = 1;
    const amount = parseInt(req.body.amount);
    const currency = req.body.currency;

    if (isNaN(amount)) {
      throw new Error("Invalid amount");
    }

    const options = {
      amount: amount * 100,
      currency,
      receipt: shortid.generate(),
      payment_capture,
    };

    try {
      const currentDate = new Date();
      const orderStatus = "Geneus Solutions New Order Initited";
      const updatedOrderStatus = `${orderStatus} on ${currentDate.toLocaleDateString()} at ${currentDate.toLocaleTimeString()}`;

      sendEmail(
        process.env.toAdmin,
        req.body.email,
        updatedOrderStatus,
        `Name: ${req.body.username}\namount: ${amount}\nreceipt: ${options.receipt}`
      );
      
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    // console.log("rezorpay", razorpay);

    const response = await razorpay.orders.create(options);
    // console.log("this is response", response);

    res.status(200).json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const paymentVerification = async (req, res) => {
  try {
    
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body;

    const PaymentInstance = new Razorpay({
      key_id: process.env.RAZORPAY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const paymentDetails = await PaymentInstance.payments.fetch(razorpay_payment_id);
    // console.log('paymentDetails : ', paymentDetails);

    // check if payment is captured
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");
      
      const isAuthentic = expectedSignature === razorpay_signature;

      if(!isAuthentic){
        return res.status(500).json({
            success: false,
            message: "Payment verification failed",
        })
      }

      const payment = await Payment.create({
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        signature: razorpay_signature,
        status: "success",
      });
      
      const {data,event/*,expectedPaymentToReceive*/} = paymentDetails.notes;

      eventBus.emit(event, {...data, paymentId: razorpay_payment_id, orderId: razorpay_order_id});


      res.status(200).json({ success: true });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};


// GET /api/payments/:userId
const getPaymentHistoryByUser = async (req, res) => {
  try {
    const userId = req.params.user_Id;
    console.log(userId)
    const payments = await Payment.find({ user_id: userId }).sort({ createdAt: -1 });
    console.log(payments, 'this is payments');
    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: "No payment history found." });
    }

    res.status(200).json({ success: true, payments });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


export { getPaymentKey,paymentVerification, postRazorpay, getPaymentHistoryByUser };
