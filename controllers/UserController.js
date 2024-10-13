const User = require('../models/User');
const Detail = require('../models/Details')
const Food = require('../models/Food');
const Plan = require('../models/Plan')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {generateAccessToken, generateRefreshToken} = require('../controllers/Auth')

const registerUser = async (req, res) => {
   try {
       const { name, email, password, mobile  } = req.body;
       if (!name) return res.status(400).json({ error: "Name is required" });
       if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
         return res.status(400).json({ error: "Valid email is required" });
       if (!password || password.length < 8) {
         return res.status(400).json({ error: "Password is required and must be at least 8 characters" });
       }
       if (!mobile) return res.status(400).json({ error: "Mobile number is required" });

       const userExists = await User.findOne({ email }).exec();
       if (userExists) {
         return res.status(400).json({ error: "Email already exists" });
       }
       const salt = await bcryptjs.genSalt(10);
       const hashedPassword = await bcryptjs.hash(password, salt);
       const newUser = new User({
         name,
         email,
         password: hashedPassword,
         mobile
       });

       // Create related details, food, and plan
       const newDetail = await Detail.create({ user: newUser._id });
       const newFood = await Food.create({ user: newUser._id });
       const freePlanPrice = 0;

       const newPlan = await Plan.create({
         userId: newUser._id,
         name: 'Free Trial',
         duration: 7,
         price: freePlanPrice
       });

       newUser.details = newDetail._id;
       newUser.food = newFood._id;
       newUser.plan = newPlan._id;
       await newUser.save();

       // Send the email without sensitive info
       const currentDate = new Date();
       const registrationRequest = "Geneus Solutions New User Registration request(Modal)";
       const updatedRegStatus = `${registrationRequest} on ${currentDate.toLocaleDateString()} at ${currentDate.toLocaleTimeString()}`;

       const mailOptions = {
         from: process.env.email,
         to: process.env.toAdmin,
         subject: updatedRegStatus,
         text: `New user registered: Name: ${name}, Email: ${email}, Mobile: ${mobile}`,
       };

       // Send the email
       await  transporter.sendMail(mailOptions, (error, info) => {
                   if (error) {
                     console.log(error);
                     return res.status(500).json({ error: "Failed to send email" });
                   }
                   console.log("Email sent:", info.response);
                 });
       return res.status(200).json({
                          message: 'User registered successfully',
                          user: {
                              id: newUser._id,
                              name: newUser.name,
                              email: newUser.email,
                              details: newUser.details,
                              food: newUser.food,
                              number : newUser.number,
                              plan : newUser.plan,
                          },
                          accessToken,
                          refreshToken
                      });
     } catch (err) {
       console.log("Error occurred", err);
       return res.status(500).json({ error: "An error occurred! Please try again later." });
     } finally {
       console.log("====FINALLY CALLED====");
     }
};

const loginUser = async (req, res) => {
    try {
       const { email, password } = req.body;
       if (!password) return res.status(400).json({ error: "Password is required" });
       if (!email) return res.status(400).json({ error: "Email is required" });
           const user = await User.findOne({ email }).exec();
       if (!user || !bcryptjs.compareSync(password, user.password)) {
         return res.status(400).json({ error: "Invalid Email or Password" });
       }
         const accessToken = jwt.sign(
           user.toJSON(),
           process.env.ACCESS_SECRET_KEY,
           { expiresIn: "15m" }
         );
         const refreshToken = jwt.sign(
           user.toJSON(),
           process.env.REFRESH_SECRET_KEY
         );
         const token = createTokens(user);
         res.cookie("token", token, {
           maxAge: 1000 * 60 * 5,
           httpOnly: true,
           sameSite: "lax",
           secure: true,
         });
         const dbToken = new Token({ token });
         const newToken = await dbToken.save();
         return res.status(200).json({
           accessToken,
           refreshToken,
           email: user.email,
           name: user.name,
           id: user.id,
         });
         } catch (error) {
       return res.status(500).json({ error: "Authentication Failed!" });
     }
};


const getUser = async (req, res) => {
    const { userId } = req.user;
    try {
        console.log(userId);
        const user = await User.findById(userId)
            .populate('details')
            .populate('food')
            .populate('plan');

        console.log(user.details.caloriegoal);
        
        const totalCalories = user.details.caloriegoal;
        const goal = user.details.goal;

        // Macronutrient percentage mapping based on the goal
        const macronutrientDistribution = {
            'Lose Weight': { protein: 30, carbs: 40, fat: 30 },
            'Gain Muscle': { protein: 35, carbs: 40, fat: 25 },
            'Athletic Performance': { protein: 30, carbs: 50, fat: 20 },
            'Maintain Weight': { protein: 30, carbs: 45, fat: 25 },
            'Gain Weight': { protein: 20, carbs: 55, fat: 25 },
            'Manage Stress': { protein: 30, carbs: 25, fat: 45 },
        };

        // Fallback to a default value if the goal is not found
        const { protein: proteinPercent, carbs: carbsPercent, fat: fatPercent } = macronutrientDistribution[goal] || { protein: 20, carbs: 50, fat: 30 };

        // Calculate macronutrients in grams based on kcal to gram conversion
        const proteinGrams = (totalCalories * (proteinPercent / 100)) / 4;  // Protein has 4 kcal/gram
        const carbsGrams = (totalCalories * (carbsPercent / 100)) / 4;    // Carbs have 4 kcal/gram
        const fatGrams = (totalCalories * (fatPercent / 100)) / 9;         // Fat has 9 kcal/gram

        console.log(`Protein: ${Math.round(proteinGrams)}g, Carbs: ${Math.round(carbsGrams)}g, Fat: ${Math.round(fatGrams)}g`);

        res.status(201).json({
            user,
            macronutrients: {
                protein: Math.round(proteinGrams),
                carbs: Math.round(carbsGrams),
                fat: Math.round(fatGrams)
            }
        });
    } catch (error) {
        console.error('Server error: ', error);
        res.status(500).json({ message: 'Server error', error });
    }
};



module.exports = {
    registerUser,
    loginUser,
    getUser
};
