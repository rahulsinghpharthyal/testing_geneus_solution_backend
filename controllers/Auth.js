const jwt = require('jsonwebtoken');
const secreat = "yash"
const User = require('../models/user')
const Auth = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        console.log('authHeader : ', authHeader);

        if (!authHeader) return next(new ErrorHandler(401, "Please log in to access"));

        const token = authHeader.split(' ')[1];
        console.log('token : ', token);

        if (!token) return next(new ErrorHandler(401, "Please log in to access"));

        
        try {
            const decodedData = jwt.verify(token, secreat);
            console.log('decodedData : ', decodedData);
             if (!decodedData.id) {
            return next(new ErrorHandler(403, "Invalid token"));
        }

        
        req.user = { userId: decodedData.id };
        next();
          } catch (verifyError) {
            console.error('Token verification failed:', verifyError);
            return next(new ErrorHandler(403, "Invalid token"));
          }
       
       
    } catch (error) {
        console.log('error : ', error);
        next(new ErrorHandler(403, "Forbidden"));
    }
};

const forgotPassword = async (req, res) => {
     try {

     const { email } = req.body;
     const user = await User.findOne({ email });
       console.log(' user info '+ user);
     if (!user) {
       return res.status(400).send('No user with that email address found. Please provide a valid email address');
     }

     const token = crypto.randomBytes(20).toString('hex');

     user.resetPasswordToken = token;
     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
     await user.save();
     const resetURL = process.env.FRONTEND_URL + `/reset-password?token=${token}`;

     const mailOptions = {
       from:process.env.toAdmin,
       to: email,
       subject: 'Password Reset',
       text: `You are receiving this because you  have requested to reset the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n${resetURL}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
     };

     // Send the email
     transporter.sendMail(mailOptions, (error, info) => {
       if (error) {
         console.log(error);
         return res.status(500).json({ error: "Failed to send email" });
       }
       console.log("Email sent:", info.response);
     });

     res.send('Password reset email sent.');
     } catch (error) {
       console.error("Error in forgot-password route:", error);
       res.status(500).send("Internal Server Error");
     }
   };

const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).send('Password reset token is invalid or has expired.');
    }

    // Hash the new password and save it
    user.password = await bcryptjs.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).send('Password has been reset successfully. Please log in');
  };

const apiVisitors = async (req, res) => {
  const { ip, city } = req.body;
  const newVisitor = new Visitor({ ip, city });

  try {
    await newVisitor.save();
    res.status(201).send('Visitor data saved successfully');
  } catch (error) {
    res.status(500).send('Error saving visitor data');
  }
};

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, secreat, { expiresIn: '10m' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, secreat , { expiresIn: '1h' });
};

const refreshTokenHandler = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.sendStatus(401);

    try {
        console.log('refreshToken : ', refreshToken);
        const user = await User.findOne({ refreshToken });
        if (!user) return res.sendStatus(403);

        jwt.verify(refreshToken, secreat, (err, decoded) => {
            if (err) return res.sendStatus(403);
            
            const accessToken = generateAccessToken(user);
            res.json({ accessToken });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
module.exports = { generateAccessToken, generateRefreshToken, Auth, refreshTokenHandler, apiVisitors, forgotPassword, resetPassword };


