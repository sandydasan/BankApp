// 1 import mongoose 
const mongoose= require('mongoose');

//2 connect string b/w mongoose and express
mongoose.connect('mongodb://localhost:27017/BankServer')

//3 create a model and schema for sharing data mongodb and express
const User=mongoose.model('User',{
    acno:Number,
    password:String,
    username:String,
    balance:Number,
    transaction:[]

})
//export the collection
module.exports={
    User
}