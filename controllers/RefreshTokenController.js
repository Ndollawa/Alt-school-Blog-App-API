const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// require('dotenv').config()

class AuthController{

login = async (req, res)=>{
    const {user_email, password} = req.body;
    if(!user_email || !password)return res.status(400).json({'message': 'Email and password are required!'});

    //check for user  in the DB
    const foundUser = await Users.findOne({refreshToken}).exec();
    if(!foundUser)return res.sendStatus(401);// unauthorized
    try{

        //evaluate password
        const match = await bcrypt.compare(password,foundUser.password);
        if(match){
            //create JWTs
            const accessToken = jwt.sign(
                {'userEmail':foundUser.email},
                process.env.ACCESS_TOKEB_SECRET,
                {expiresIn: '300s'}
            );
            const refreshToken = jwt.sign(
                {'userEmail':foundUser.email},
                process.env.ACCESS_TOKEB_SECRET,
                {expiresIn: '1d'}
            );
                //save refresh token of current user 
                
            res.cookie('jwt', refreshToken,{httpOnly:true,maxAge:24*60*60*1000});
            res.json({accessToken})

        res.status(201).json({'success':   `User ${user_email} logged in!`
        })
    } else{
            res.sendStatus(401);
        }
      
    }catch(err){
        res.status(500).json({'message': err.message});
    }
}
logout =(req, res)=>{

}

}

export default AuthController;