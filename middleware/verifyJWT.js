import jwt from 'jsonwebtoken';
// require('dotenv').config();

const verifyJWT = (req, res, next)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer ')) return res.sendStatus (401);
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decodedToken)=>{
            if(err)return res.sendStatus(403);// invalid token

            req.user = decodedToken.userInfo.user;
            req.username = decodedToken.userInfo.username;
            req.userEmail = decodedToken.userInfo.userEmail;
            req.roles = decodedToken.userInfo.roles;
            next();
        }
    );
}

export default verifyJWT;