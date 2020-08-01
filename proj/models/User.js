const mongoose = require('mongoose') 
const UserSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email :{
        type:String,
        unique : true,
    },
    is_admin : {
        type : Boolean,
        default :false 
    },
    Bio :String,
    password:{
        type:String,
        minLength:8
    },
},{
    timestamps:true
})

const User = mongoose.model('User', UserSchema);
module.exports = User  ;