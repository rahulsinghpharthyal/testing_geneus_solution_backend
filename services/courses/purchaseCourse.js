import MyLearning from "../../models/Mylearnings.js";
import sendEmail from "../../controllers/EmailController.js";
import eventBus from "../../utilities/createEvent.js";
import User from "../../models/User.js";
import { handleVoucherPostPayment } from "../voucherUsageServices/findVoucherUsage.js";

eventBus.on("purchase_course", async (data) => {
  try {
    const { userId, courseIds, paymentId, orderId, token } = data;
    // update courses Id to MyLearning model
    const user = await User.findById(userId);
    console.log("this is user", user);
    const updatedMyLearning = await MyLearning.findOneAndUpdate(
      { userId: userId },
      { $push: { courses_id: courseIds } },
      { new: true, upsert: true }
    );

    if (token) {
      await handleVoucherPostPayment(userId, token);
    }

    // Create a nodemailer transporter
    const currentDate = new Date();
    const orderStatus = "Geneus Solutions New Order Placed";
    const updatedOrderStatus = `${orderStatus} on ${currentDate.toLocaleDateString()} at ${currentDate.toLocaleTimeString()}`;

    sendEmail(
      process.env.toAdmin,
      user?.email,
      updatedOrderStatus,
      `Dear user\n\nThank you for Enrolling the course. We have received the request.\n\norder id: ${orderId}\npayment id: ${paymentId}\nuser id: ${userId}. \n\nTo start learning goto https://www.geneussolutions.in/ and click on My Learning on the top right page. Thank you \n\nFor any queries, kindly reach out to us on support@geneussolutions.in. Happy Learning!\n\nThank you and Warm Regards,\nGeneus Solutions\n+91 9148950239`
    );
  } catch (error) {
    console.log("Error in event handler:", error);
  }
});
