import  UserModel from '../models/User.js';
import  bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// require('dotenv').config()

class AuthController{

    // handles user registration
register = async (req, res)=>{
    const {first_name, last_name, user_email, password, username} = req.body;
    if(!user_email || !password)return res.status(400).json({'message': 'Email and password are required!'});

    //check for duplicate emails in the DB
    const duplicate = await UserModel.findOne({email:user_email}).exec();
    if(duplicate)return res.sendStatus(409);// conflict
    try{

        //encrypt password
        const hashedPassword = await bcrypt.hash(password,10);

        // create and save new User
        const newUser = await UserModel.create({
            "first_name":first_name,
            "last_name":last_name,
            'email': user_email,
            'username' : username,
            // 'roles':{'Author':3},
            'password':hashedPassword});
        // userDB.
        res.status(201).json({'message':   `New user ${user_email} created!`});
    }catch(err){
        res.status(500).json({'message': err.message});
    }
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
            const accessToken = jwt.sign(
                {
                    userInfo:{

                        'user':foundUser._id,
                        'userEmail':foundUser.email, 
                        'username':foundUser.username,
                        'roles':foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '1h'}
            );
            const refreshToken = jwt.sign(
                {'userEmail':foundUser.email},
                process.env.ACCESS_TOKEN_SECRET
            );
                //save refresh token of current user secure:true, 
                foundUser.refreshToken = refreshToken;
                const result = await foundUser.save() 
                
            res.cookie('jwt', refreshToken,{httpOnly:true,sameSite:'None', maxAge: 24
            *60*60*7});
            res.json({accessToken})

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
            const accessToken =jwt.sign(
                {
                    userInfo:{
                        'user':decodedToken.user,
                        'userEmail':decodedToken.email, 
                        'username':decodedToken.username, 
                        'roles':decodedToken.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '1h'}
            )
        }
        );
        
}

}

export default new AuthController();