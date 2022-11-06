import { request } from 'express';
import  PostModel from '../models/Post.js';
class PostController{
     
   constructor(){
        this.index = this.index.bind(this);
    

   }
   index = async (req, res)=>{
    const Post = await PostModel.find();
    if(!Post) return res.status(204).json({'message': 'No Post found!'});
    res.json(Post);
    }
    show = async (req, res)=>{
        if(!req?.params?.id)
        {
           return res.status(400).json({'message':'ID parameter is required.'})
       }
       const post = await PostModel.findOne({_id:request.params.id}).exec();
       if(!post) return res.status(204).json({'message':`No post matches ID ${req.params.id}.` });
        //check for a Post in the DB 
    
      res.json(post);
        
    }
    create = async (req, res)=>{
        // if(!req?.body?.title || !req?.body?.body || !req?.body?.tags || !req?.body?.description)
        // {
        //     return res.status(400).json({'message':'Post Title,Body,Tags and Description are required.'})
        // }
    //    const {title, body, tags, description} = req.body
    //    const foundTiltle =  await Users.findOne({title}).exec();
    //    if(foundTiltle) return res.sendStatus(409);// conflict, category
    //    const userId = req.user
    console.log(req.user);
        res.json(req.user);
        try{
            // create and save new Post
            // const newPost = await Post.create({
            //     "title":title,
            //     "author": userId,
            //     "body":body,
            //     'tags': tags,
            //     'category' : category,
            //     'description':description,
            //     'password':hashedPassword});
            // // userDB.
            // res.status(201).json({'message':   `New user ${user_email} created!`});
            }catch(err){
            res.status(500).json({'message': err.message});
            }
    }
    edit = async(req, res)=>{
        if(!req?.params?.id)
        {
            return res.status(400).json({'message':'ID parameter is required.'})
        }
        const post = await PostModel.findOne({_id:request.body.id}).exec();
        if(!post) return res.status(204).json({'message':`No post matches ID ${req.body.id}.` });
        res.status(200).json(post);
    }   
    update = async(req, res)=>{
        if(!req?.body?.id)
         {
            return res.status(400).json({'message':'ID parameter is required.'})
        }
        const post = await PostModel.findOne({_id:request.body.id}).exec();
        if(!post) return res.status(204).json({'message':`No post matches ID ${req.body.id}.` });
        if(req.body?.title) post.title = req.body.title;
        if(req.body?.body) post.body = req.body.body;
        if(req.body?.tags) post.tags = req.body.tags;
        if(req.body?.description) post.description = req.body.description;
        if(req.body?.state) post.state = req.body.state;
        // if(req.body?.category) post.category = req.body.category;
        // if(req.body?.title) post.title = req.body.title;
        // if(req.body?.title) post.title = req.body.title;
        const result = await post.save();
        res.json(result);
    }
    delete = async(req, res)=>{
        if(!req?.body?.id)
        {
           return res.status(400).json({'message':'ID parameter is required.'})
       }
       const post = await PostModel.findOne({_id:request.body.id}).exec();
       if(!post) return res.status(204).json({'message':`No post matches ID ${req.body.id}.` });
       const result = await post.deleteOne({_id:req.body.id});
       res.json(result);
    }


}
export default PostController;