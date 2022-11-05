import  bcrypt from 'bcrypt'


class UserController{
   
    index = (req, res)=>{

    }
    show = (id)=>{

    
    }
    create = async (req, res)=>{
        const {user_email, password} = req.body;
        if(!user_email || !password)return res.status(400).json({'message': 'Email and password are required!'});

        //check for duplicate emails in the DB
        // const duplicate = UsersDB.users.find(person=>person.email === email);
        if(duplicate)return res.sendStatus(409);// conflict
        try{

            //encrypt password
            const hashedPassword = await bcrypt.hash(password,10);

            // save new User
            const newUser = {
            'email': user_email, 
            'roles':{'Author':3},'password':hashedPassword};
            // userDB.
            res.status(201).json({'message':   `New user ${user_email} created!`});
        }catch(err){
            res.status(500).json({'message': err.message});
        }
    }
    edit = (id)=>{

    }
    update = (id)=>{

    }
    delete = (id)=>{

    }


}
;
export default new UserController();