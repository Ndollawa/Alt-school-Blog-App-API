class PostController{
   constructor(){
        this.index = this.index.bind(this);
    

   }
   index = (req, res)=>{
    console.log(req.body);
        res.send("Hi there");
    }
    show = (id)=>{

    
    }
    create = (req, res)=>{

    }
    edit = (id)=>{

    }
    update = (id)=>{

    }
    delete = (id)=>{

    }


}
export default PostController;