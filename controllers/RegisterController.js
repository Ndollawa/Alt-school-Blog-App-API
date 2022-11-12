import  UserModel from '../models/User.js';
import  bcrypt from 'bcrypt';
import path from 'path';
import {fileURLToPath} from 'url';
// require('dotenv').config()
 const __filename = fileURLToPath(import.meta.url);

        // 
        const __dirname = path.dirname(__filename);
class RegisterController{
    constructor(){
        this.index = this.index.bind(this);
       

   }
index = (req, res)=>{

    res.renderFile(path.join(__dirname,'views','register'));
}
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
            // 'roles':{'Registeror':3},
            'password':hashedPassword});
        // userDB.
        res.status(201).json({'message':   `New user ${user_email} created!`});
    }catch(err){
        res.status(500).json({'message': err.message});
    }
}


}

export default new RegisterController();