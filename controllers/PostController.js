import { request } from 'express';
import  PostModel from '../models/Post.js';
class PostController{
     
   constructor(){
        this.index = this.index.bind(this);
    

   }
   index = async (req, res)=>{
    // Item.findOne(...).populate('comments').exec((err, item) => {
    //     console.log(item.comments);
    // });
    const Post = await PostModel.find().populate('author').exec();
    const customLabels = {
        totalDocs: 'itemCount',
        docs: 'itemsList',
        limit: 'perPage',
        page: 'currentPage',
        nextPage: 'next',
        prevPage: 'prev',
        totalPages: 'pageCount',
        pagingCounter: 'slNo',
        meta: 'paginator',
      };
      
      const options = {
        page: req?.query?.page || 1,
        limit: req?.query?.limit || 20,
        populate:["author"],
        sort:({createdAt:-1}),
        customLabels: customLabels,
      };
      
     
    if(!Post) return res.status(204).json({'message': 'No Post found!'});
   
     PostModel.paginate({}, options, function (err, result) {
        result.itemsList//[here docs become itemsList]
        // result.paginator.itemCount //[here totalDocs becomes itemCount]
        // result.paginator.perPage //[here limit becomes perPage]
        // result.paginator.currentPage  //[here page becomes currentPage]
        // result.paginator.pageCount //[here totalPages becomes pageCount]
        // result.paginator.next  //[here nextPage becomes next]
        // result.paginator.prev //[here prevPage becomes prev]
        // result.paginator.slNo //[here pagingCouwnter becomes slNo]
        // result.paginator.hasNextPage 
        // result.paginator.hasPrevPage
        res.json(result);
      });

    // res.json(Post)
    }
    show = async (req, res)=>{
        if(!req?.params?.id)
        {
           return res.status(400).json({'message':'ID parameter is required.'})
       }
       const query = {_id:req.params.id}
       const message = `No post matches ID ${req.params.id}.`;
       const post = await PostModel.findOne(query).exec();
    if(!post) return res.status(204).json({'message':message});
        //check for a Post in the DB 
      const  updateCount = await PostModel.findOneAndUpdate({_id:post._id} ,{ read_count: (post.read_count + 1) });
    //   await updateCount.save()
    const customLabels = {
      totalDocs: 'itemCount',
      docs: 'itemsList',
      limit: 'perPage',
      page: 'currentPage',
      nextPage: 'next',
      prevPage: 'prev',
      totalPages: 'pageCount',
      pagingCounter: 'slNo',
      meta: 'paginator',
    };
    
    const options = {
      // page: req?.query?.page || 1,
      // limit: req?.query?.limit || 20,
      populate:["author"],
      sort:({createdAt:-1}),
      customLabels: customLabels,
    };
 
   PostModel.paginate(query, options, function (err, result) {
  
      res.json(result);
    });
      // res.json(post);
        
    }
    create = async (req, res)=>{
           
        if(!req?.body?.title || !req?.body?.body || !req?.body?.tags || !req?.body?.description)
        {
            return res.status(400).json({'message':'Post Title,Body,Tags and Description are required.'})
        }
       const {title, body, tags, description, category} = req.body
       const foundTiltle =  await PostModel.findOne({title}).exec();
       if(foundTiltle) return res.sendStatus(409);// conflict
       const userId = req.user;
             const wpm = 225;
            const words = body.trim().split(/\s+/).length;
            const readTime = Math.ceil(words / wpm);
         
        try{    
            // create and save new Post
            const newPost = await PostModel.create({
                "title":title,
                "author": userId,
                "body":body,
                'tags': tags,
                'category' : category,
                'description':description,
                'reading_time':readTime
            });
            // userDB.
            res.status(201).json({'message':   `New Post '${title}' created!`});
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
        const {title, body, tags, description, category} = req.body
        const foundTiltle =  await PostModel.findOne({title}).exec();
        if(foundTiltle) return res.sendStatus(409);// conflict
        const post = await PostModel.findOne({_id:req.body.id}).exec();
        if(!post) return res.status(204).json({'message':`No post matches ID ${req.body.id}.` });
        if(req.body?.title) post.title = title;
        if(req.body?.body) post.body = body;
        if(req.body?.tags) post.tags = tags;
        if(req.body?.description) post.description = description;
        if(req.body?.state) post.state = req.body.state;
        if(req.body?.category) post.category = category;
        // if(req.body?.title) post.title = req.body.title;
        // if(req.body?.title) post.title = req.body.title;
        const result = await post.save();
       res.json({"message":`The Post '${title}' updated`,'post':result});
    }
    delete = async(req, res)=>{
        if(!req?.body?.id)return res.status(400).json({'message':'ID parameter is required.'});
    
       const post = await PostModel.findOne({_id:req.body.id}).exec();
       if(!post) return res.status(204).json({'message':`No post matches ID ${req.body.id}.` });
       const result = await post.deleteOne({_id:req.body.id});
        res.json({"message":`The Post '${title}' Deleted`});
    }
    showPostByAuthor = async (req, res)=>{
      if(!req?.params?.author)
        {
           return res.status(400).json({'message':' Author parameter is required.'})
       }
       const qstate = (req?.query?.state)?{state:req?.query?.state} : {};
       const query = {author:req.params.author, ...qstate }
       const message = `No post matches Author ${req.params.author}.`;
       const post = await PostModel.findOne(query).exec();
    if(!post) return res.status(204).json({'message':message});
      const customLabels = {
          totalDocs: 'itemCount',
          docs: 'itemsList',
          limit: 'perPage',
          page: 'currentPage',
          nextPage: 'next',
          prevPage: 'prev',
          totalPages: 'pageCount',
          pagingCounter: 'slNo',
          meta: 'paginator',
        };
        
        const options = {
          page: req?.query?.page || 1,
          limit: req?.query?.limit || 20,
          populate:["author"],
          sort:({createdAt:-1}),
          customLabels: customLabels,
        };
        
     
       PostModel.paginate(query, options, function (err, result) {
          res.json(result);
        });
  
      // res.json(Post)
      }


      search = async (req, res)=>{
        if(!req?.query?.q)
        {
           return res.status(400).json({'message':' Search parameter is required.'})
       }
         const qauthor = (req?.query?.author)?{author:req?.query?.author} : {};
         const qtags = (req?.query?.tags)?{tags:req?.query?.tags} : {};
         const qtitle = (req?.query?.title)?{title:req?.query?.title} : {};
         const qcategory = (req?.query?.category)?{category:req?.query?.category} : {};
         const query = {...qauthor , ...qtitle, ...qtags, ...qcategory}
         const message = `No post matches  ${req.query.title?.tag?.category}.`;
         const post = await PostModel.findOne(query).exec();
      if(!post) return res.status(204).json({'message':message});
        const customLabels = {
            totalDocs: 'itemCount',
            docs: 'itemsList',
            limit: 'perPage',
            page: 'currentPage',
            nextPage: 'next',
            prevPage: 'prev',
            totalPages: 'pageCount',
            pagingCounter: 'slNo',
            meta: 'paginator',
          };
          
          const options = {
            page: req?.query?.page || 1,
            limit: req?.query?.limit || 20,
            populate:["author"],
            sort:({createdAt:-1}),
            customLabels: customLabels,
          };
          
       
         PostModel.paginate(query, options, function (err, result) {
            result.itemsList//[here docs become itemsList]
          
            res.json(result);
          });
    
        // res.json(Post)
        }

}
export default PostController;