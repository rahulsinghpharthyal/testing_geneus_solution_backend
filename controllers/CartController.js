import Cart from "../models/Cart.js";
import MyLearning from "../models/Mylearnings.js";
import { configDotenv } from 'dotenv';
configDotenv()


const getCart = async (req, res) => {
  try {

    const { userId } = req.user;

    if (!userId) {
      return res.status(401).send({ message: "User ID is missing" });
    }
    const cart = await Cart.findOne({ userId }).populate("coursesIds" , '_id title img description level price discount_price price').exec();
    // console.log("this is cart", cart);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const {coursesIds:courses,cartItemLength} = cart;

    return res.status(200).json({courses, cartItemLength});
    
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Error fetching cart items" });
  }
}

const addtoCart = async (req, res) => {
    try {

      const { userId } = req.user;

      const {courseId} = req.body;

      if (!userId) {
        return res.status(401).send({ message: "User ID is missing" });
      }
  
      if (!courseId) {
        return res.status(401).send({ message: "Course item is missing" });
      }
  
      const mylearning = await MyLearning.findOne({userId})
  
      if (mylearning) {
        const courseIndex = mylearning?.courses_id?.findIndex(
          (id) => id.toString() === courseId.toString()
        );

        if (courseIndex !== -1) {
          return res.status(400).json({ message: "Course already purchased" });
        }
      }
  
      const cart = await Cart.findOne({ user_id: userId });

      const courseExists = cart?.coursesIds?.includes(courseId);
      
      if (courseExists) {
        return res.status(400).json({ message: "Course already in cart" });
      }

      const updatedCartData = await Cart.findOneAndUpdate(
        { user_id: userId },
        { $push: { coursesIds: courseId }, cartItemLength: cart?.cartItemLength ? cart?.cartItemLength + 1 : 1 },
        { new: true, upsert: true }
    );

      return res.status(200).json({ message: "Course added to cart" });

    } catch (error) {
      console.log("Error adding course to cart:", error);
      return res.status(500).json({ message: "Error adding course to cart" });
    }
  }

const cartEmpty = async (req, res) => {
    try {
      const { cart_id } = req.body;
      if (!cart_id) {
        return res.status(404).send({ message: "Cart ID is missing" });
      }
      const cart = await Cart.findById(cart_id);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      cart.cart_items = [];
      cart.cart_total = 0;
      cart.discount = 0;
      cart.total_after_discount = 0;
      await cart.save();
      return res.status(200).json({ cartItems: cart });
    } catch (error) {
      console.error("Error emptying cart:", error);
      return res.status(500).json({ message: "Error emptying cart" });
    }
  }

  const cartDelete = async (req, res) => {

    try {

      const { userId } = req.user;

      const { course_id } = req.body;

      if (!userId || !course_id) {
        return res
          .status(400)
          .json({ message: "Both user_id and course_id are required." });
      }

      const cart = await Cart.findOne({ userId }).exec();
      
      if (!cart) {
        return res.status(404).json({ message: "Cart not found." });
      }

      // Check if the course_id exists in the cart or not

      const isExists = cart.coursesIds.includes(course_id);

      if (!isExists) {
        return res.status(404).json({ message: "Course not found in cart." });
      }

      // Remove the course_id from the cart

      cart.coursesIds = cart.coursesIds.filter(
        (course) => course.toString() !== course_id.toString()
      );
      cart.cartItemLength = cart.cartItemLength - 1;
      await cart.save();

      return res.status(200).json({ message: "Item deleted successfully" });

    } catch (error) {
      console.error("Error deleting cart item:", error);
      res.status(500).json({
        message: "Error deleting cart item",
        error: error.message,
      });
    }
  
   
  }

export {
cartDelete, cartEmpty, getCart, addtoCart
  }
