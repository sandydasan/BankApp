//import db.js
const{response}= require('express');
const db=require('./db')
const jwt =require('jsonwebtoken')


const register=(acno,password,username)=>{
console.log('Inside the register function');
//to check acno in mongodb
return db.User.findOne({acno}).then((response)=>{
    console.log(response);
    if(response){
        return{
            statusCode:401,
            message:"Account already registered"
        }
    }
    else{
        //accno is not present in mongodb , then it register new account
        const newUser=new db.User({
            acno,password,username,balance:5000,transaction:[]
        })
        //to store the new account in mongodb 
        newUser.save()
        //send response as register sucess to client
        return{
            statusCode:200,
            message:"Account Registered successfully"
        }
    }
})
}

const  login=(acno,password)=>{
    console.log('Inside the register function');

 return db.User.findOne({acno,password}).then((result)=>{
    console.log(result);
    if(result){
        //generate token
        const token= jwt.sign({loginAcno:acno},'superkey2023')
        return{
            statusCode:200,
            message :"Login Sucessfully",
            currentUser:result.username,//send username to client
            token,
            currentAcno:result.acno
        }
    }
    else{
        return{
               statusCode:401,
               message:"Not a valid data"
        }
    }
 })
}


const getBalance=(acno)=>{
     //check acno number in mongodb
     return db.User.findOne({acno}).then((result)=>{
        if(result){
            return{
                statusCode:200,
                balance:result.balance//send balance to client
            }
        }
        else{
            return{
                statusCode:404,
                message:"Invalid Account Number "//send error massage to client 
            }
        }
     })
}


const fundTransfer=(fromAcno,fromAcnoPswd,toAcno,amt)=>{
    //logic of transfer
    //convert amount to number
    let amount = parseInt(amt)
    //to check fromAcno in mongodb
    return db.User.findOne({acno:fromAcno,password:fromAcnoPswd}).then((debit)=>{
        if(debit){
            //to check toAcno in mongodb
            return db.User.findOne({acno:toAcno}).then((credit)=>{
                if(credit){
                    if(debit.balance >= amount){
                        debit.balance -= amount;
                        debit.transaction.push({
                            type :'Debit',
                            amount,
                            fromAcno,
                            toAcno
                        })
                        //save changes in mongodb
                        debit.save()

                        //update in toAcno 
                        credit.balance+= amount
                        credit.transaction.push({
                            type :'Credit',
                            amount,
                            fromAcno,
                            toAcno
                        })
                        credit.save()  

                        //send response to the client
                        return{
                            statusCode:200,
                            message:"Fund Transfer Successfull.........."
                        }
                        
                    }
                    else{
                        return{
                            statusCode:401,
                            message:"Insufficient funds..."
                        }
                    }
                }
                else{
                    return{
                        statusCode:401,
                        message:"Invalid Credit Details.."
                    }
                }
            })
        }
        else{
            return{
                statusCode:401,
                message:"Invalid Debit Details..."
            }
        }
    })

   
}
const getTransactions =(acno)=>{
   //get all transaction from mongodb
   //check acno in mongodb
   return db.User.findOne({acno}).then((result)=>{
    if(result){
        return{
            statusCode:200,
            transaction:result.transaction

        }
    }else{
        return{
            statusCode:404,
            message:'Invalid Data'
        }
    }
   })
}


const deleteMyAccount=(acno)=>{
    //delete an acoount from the mongodb
    return db.User.deleteOne({acno}).then((result)=>{
        return{
            statusCode:200,
            message:"Your account has been  delete"

        }
    })
}

module.exports={
    register,
    login,
    getBalance,
    fundTransfer,
    getTransactions,
    deleteMyAccount
}

