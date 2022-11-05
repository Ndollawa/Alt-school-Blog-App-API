const User = require('../models/User')
const bcrypt = require('bcrypt')


const register = async (req, res)=>{
    const {user_email, password, username} = req.body;
    if(!user_email || !password)return res.status(400).json({'message': 'Email and password are required!'});

    //check for duplicate emails in the DB
    const duplicate = await Users.findOne({email:user_email}).exec()?. Users.findOne({username:username}).exec();
    if(duplicate)return res.sendStatus(409);// conflict
    try{

        //encrypt password
        const hashedPassword = await bcrypt.hash(password,10);

        // create and save new User
        const newUser = await User.create({
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