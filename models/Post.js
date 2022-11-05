const mongoose = require('mongoose');
const Schema = mongooseSchema;

const PostSchema =  new Schema({
    author:{
        type:String,
        required: true
    },
    title:{
        type:String,
        required: true,
        unique: true
    },
    content:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
        
    },
    tags:{
        type:String,
        required: true
    },
    category:{
        type:String,
        required: true
    },
    comments:[{
        body:String,
    
    }],
    status:{
        type:String,
        default:'draft',
        required: true   
    },
    read_count:{
        type:Number,
        required: true
    },
    reading_time:{
        type:String,
        required: true
    },
    created_at:{
        type:Date,
        required: true,
        default:Date.now
    },
    updated_at:{
        type:Date,
        required: true
    }

});

module.exports = mongoose.model('Post',PostSchema);