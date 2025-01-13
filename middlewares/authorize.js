import User from '../models/User.js';

const Authorise = (role) => {
  
    return async(req,res,next) => {

        const foundUser = await User.findOne({ _id: req.user.userId });
        
        if(!foundUser) return res.status(403).json({message: 'unauthorized'});
      
        if(!role.includes(foundUser.role)) return res.status(403).json({message: 'unauthorized'});

        next();
    }
}


export { Authorise };