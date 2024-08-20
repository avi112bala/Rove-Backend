const { string } = require('joi');
const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    name:String,
    email:String,
});

module.exports=mongoose.model('users',userSchema);