const mongoose = require('mongoose') ;

const ItemSchema = mongoose.Schema({
    name :{
        type:String,
        required:true,
        unique:true
    },
    pic :{
        type:String
    },
    price : {
        type: Number,
        required: true
    },
    Info:{
        type:String
    }
   
},{
    timestamps:true
})

const Item = mongoose.model('Item', ItemSchema);
module.exports = Item;