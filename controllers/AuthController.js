const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// require('dotenv').config()

class AuthController{

login = async (req, res)=>{
    const {user_email, password, username} = req.body;
    if(!user_email || !password)return res.status(400).json({'message': 'Email and password are required!'});

    //check for user  in the DB || username:username

    const foundUser = await Users.findOne({email:user_email}).exec()?. Users.findOne({username:username}).exec();
    if(!foundUser)return res.sendStatus(401);// unauthorized
    try{

        //evaluate password
        const match = await bcrypt.compare(password,foundUser.password);
        if(match){
            //create JWTs
            const accessToken = jwt.sign(
                {
                    userInfo:{
                        'userEmail':foundUser.email, 
                        'username':foundUser.username,
                        'roles':roles
                    }
                },
                process.env.ACCESS_TOKEB_SECRET,
                {expiresIn: '300s'}
            );
            const refreshToken = jwt.sign(
                {'userEmail':foundUser.email},
                process.env.ACCESS_TOKEB_SECRET,
                {expiresIn: '1d'}
            );
                //save refresh token of current user 
                foundUser.refreshToken = refreshToken;
                const result = await foundUser.save() 
                
            res.cookie('jwt', refreshToken,{httpOnly:true,secure:true, sameSite:'None', maxAge:24*60*60*1000});
            res.json({accessToken})

        res.status(201).json({'success':   `User ${user_email?.username} logged in!`
        })
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
    const foundUser = await Users.findOne({refreshToken}).exec();
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
    const foundUser = await Users.findOne({refreshToken}).exec();
    if(!foundUser)return res.sendStatus(401);// unauthorized
        const refreshToken = cookies.jwt;
        //evaluate jwt
       jwy.verify(
        refreshToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decodedToken)=>{
            if(err || foundUser.email !== decodedToken.userEmail) return res.sendStatus(403);
            const accessToken =jwt.sign(
                {
                    userInfo:{
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

export default AuthController;