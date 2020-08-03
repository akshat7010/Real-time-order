const mongoose  = require('mongoose')
require('dotenv').config()

mongoose.connect("mongodb+srv://Kunal:Kunal1234%23%23@cluster0.rnqav.gcp.mongodb.net/Restau?retryWrites=true&w=majority",{useCreateIndex:true,useNewUrlParser: true,useUnifiedTopology: true,
    retryWrites:true,
    useFindAndModify:true})
const db = mongoose.connection ;
db.on('error',(err)=>{
    console.log(err)
})
db.on('open',()=>{
    console.log('Db is connected')
})

module.exports = db 