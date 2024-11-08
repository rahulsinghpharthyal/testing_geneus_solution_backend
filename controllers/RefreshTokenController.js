import user from "../models/User.js";
import Jwt from "jsonwebtoken";
import { generateAccessToken } from "./AuthController.js";

const getRefreshToken = async (req, res,next) => {

    const cookies = req.cookies;
console.log('cookies',cookies)
    if(!cookies.refreshToken) {
        return res.status(401).json({message:'Please logIn to access'});
    }
    
    const refreshToken = cookies.refreshToken;
    console.log('incoming refreshToken',refreshToken)
    const foundUser = await user.findOne({refreshToken:refreshToken}).lean();
    console.log('foundUser refreshToken',foundUser)
    if(!foundUser) return res.status(401).json({message:'Please logIn to access'});

    Jwt.verify(refreshToken,process.env.REFRESH_SECRET_KEY,(err,decodedUser)=>{

        if(err || foundUser._id.toString() !== decodedUser.id) {
            return res.status(401).json({message:'Please logIn to access'});
        }
        console.log('foundUser',foundUser)
        // const accessToken = Jwt.sign({_id:foundUser._id},process.env.ACCESS_SECRET_KEY,{expiresIn:'30s'});
        const accessToken = generateAccessToken(foundUser);
        console.log('accessToken',accessToken)
        const user = {
            id: foundUser._id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role,
            plan : foundUser.plan
        }
        res.status(200).json({...user,accessToken});
    })

}

export {getRefreshToken};
