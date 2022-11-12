import  UserModel from '../models/User.js';
import  bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import {fileURLToPath} from 'url';
// require('dotenv').config()
  const __filename = fileURLToPath(import.meta.url);

        // 
        const __dirname = path.dirname(__filename);

  
class AuthController{
    constructor(){
        this.index = this.index.bind(this);
      
    // handles form
 }
   index =(req, res)=>{
    res.render(path.join(__dirname,'views','login'));
   }
    //hanles user login
    login = async (req, res)=>{
        const {user_email, password} = req.body;
    if(!user_email || !password)return res.status(400).json({'message': 'Email and password are required!'});

    //check for user  in the DB || username:username

    const foundUser = await UserModel.findOne({email:user_email}).exec();
    if(!foundUser)return res.sendStatus(401);// unauthorized
    try{

        //evaluate password
        const match = await bcrypt.compare(password,foundUser.password);
        if(match){
            //create JWTs
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    'userInfo':{

                        'user':foundUser._id,
                        'userEmail':foundUser.email, 
                        'username':foundUser.username,
                        'roles':roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '300s'}
            );
            const refreshToken = jwt.sign(
                {'userEmail':foundUser.email},
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn:'1h'}
            );
                //save refresh token of current user 
                foundUser.refreshToken = refreshToken;
                const result = await foundUser.save() 
                
            res.cookie('jwt', refreshToken,{httpOnly:true, secure:true, sameSite:'None', maxAge: 24
            *60*60*7});
            res.json({'message':"successfully logged in",'token':accessToken})

        // res.status(201).json({'success':   `User ${user_email?.username} logged in!`
        // })
    } else{
            res.sendStatus(401);
        }
      
    }catch(err){
        res.status(500).json({'message': err.message});
    }
}
logout = async (req, res)=>{
    const cookies = req.cookies;
    if(!cookies?.jwt)return res.sendStatus(401);

    //on logout delete access token
    const foundUser = await UserModel.findOne({refreshToken}).exec();
    if(!foundUser)return res.sendStatus(204);// unauthorized
    res.clearCookie('jwt',{httpOnly:true, secure:true, sameSite:'None' })   
    
   //delete refresh token from DB
    foundUser.refreshToken = '';
    const result = await foundUser.save();

}
refreshTokenHandler = async (req, res)=>{
    const cookies = req.cookies;
    if(!cookies?.jwt)return res.sendStatus(401);

    //check for user  in the DB

    const foundUser = await UserModel.findOne({refreshToken}).exec();
    if(!foundUser)return res.sendStatus(401);// unauthorized
        const refreshToken = cookies.jwt;
        //evaluate jwt

       jwt.verify(
        refreshToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decodedToken)=>{
            if(err || foundUser.email !== decodedToken.userEmail) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles);
            const accessToken =jwt.sign(
                {
                    "userInfo":{
                        'user':decodedToken.user,
                        'userEmail':decodedToken.userEmail, 
                        'username':decodedToken.username, 
                        'roles':roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '300s'}
            )
        }
        );
        
}

}

export default new AuthController();