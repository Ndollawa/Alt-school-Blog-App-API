const mongoose = require('mongoose');
const Schema = mongooseSchema;

const UserSchema =  new Schema({
    first_name:{
        type:String,
        required: true
    },
    last_name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    username:{
        type:String
    },
    password:{
        type:String,
        required: true
    },
     phone:{
        type:String
    },
    dob:{
        type:String
    },
    roles:{
       Author:{
        type: Number,
        default: 3
       },
       Editor: Number,
       Admin: Number
    },
    user_image:{
        type:String
    },
    refreshToken: String,
    created_at:{
        type:String,
        required: true
    },
    updated_at:{
        type:String,
        required: true
    }

});

module.exports = mongoose.model('User',UserSchema);