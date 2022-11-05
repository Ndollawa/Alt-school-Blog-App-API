import  Posts from '../models/Post.js';
class PostController{
     
   constructor(){
        this.index = this.index.bind(this);
    

   }
   index = (req, res)=>{
        res.json(Posts);
    }
    show = async (req, res)=>{
        const {id} = req.params;
        if(!id)return res.status(400).json({'message': 'Resource id is required!'});
    
        //check for a Post in the DB 
    
        const foundPost = await Posts.findOne(id).exec();
        
        try{

        }catch(err){

        }
    }
    create = async (req, res)=>{


        try{

        }catch(err){

        }

    }
    edit = (req, res)=>{

    }
    update = (req, res)=>{

    }
    delete = (req, res)=>{

    }


}
export default PostController;