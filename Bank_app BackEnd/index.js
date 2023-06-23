// create server using express

//1. import express

const express = require('express');

//4.import cors
const cors =require('cors')

//8 import logic.js
const logic = require('./services/logic')
//import jwt token
const jwt =require('jsonwebtoken')

//2. create server using express
const server =express()

//5.using cors in server app
server.use(cors({
    origin:'http://localhost:4200'
}))

//6. To parse json data to js in server app- use express.json()
server.use(express.json())

//3. setup port for server app
server.listen(5000,()=>{
    console.log('server listening on port 5000');
})

//7.To resolve client request in server
//server.get('/',(req,res)=>{
  //  res.send('get ')
//})

//server.post('/',(req,res)=>{
  //  res.send('get post')
//})

//Application specific middleware 
const appMiddleware =(req,res,next)=>{
  console.log('Application specific middleware');
  next();
}
server.use(appMiddleware)//function call

//Router specific middleware
const jwtMiddleware= (req,res,next)=>{
  //middleware for verifying token to check user is logged in or not
  console.log('Router specific middleware');
  //get the token from the requset header
  const token = req.headers['verify-token'];//token
  console.log(token);
  try{
      //verify the token
  const data=jwt.verify(token,'superkey2023')
  console.log(data);//{ loginAcno: '100', iat: 1686034207 }
  req.currentAcno=data.loginAcno//to get the current acno
  next()
  
  }
  catch{
      res.status(401).json({message:"please Login....."})
  }
  
}



//register - post
server.post('/register',(req,res)=>{
    console.log('inside register api');
    console.log(req.body);

    //logic for register
    logic.register(req.body.acno,req.body.password,req.body.username).then((result)=>{
        res.status(result.statusCode).json(result)
    })
    
})

//login
server.post('/login',(req,res)=>{
  console.log('Inside login api');
  console.log(req.body);

  logic.login(req.body.acno,req.body.password).then((result)=>{
    res.status(result.statusCode).json(result)
  })
})

//balance Enquiry
server.get('/balance/:acno',jwtMiddleware,(req,res)=>{
  console.log('Invalid the getbalance api');
  console.log(req.params);

  logic.getBalance(req.params.acno).then((result)=>{
    res.status(result.statusCode).json(result)
  })
})

//fund transfer
server.post('/fund-transfer',jwtMiddleware,(req,res)=>{
  console.log('Inside fund transfer api');
  console.log(req.body);
  logic.fundTransfer(req.currentAcno,req.body.password,req.body.toAcno,req.body.amount).then((result)=>{
    res.status(result.statusCode).json(result)
  })
})

//get Transaction
server.get('/get-transaction',jwtMiddleware,(req,res)=>{
  console.log('Inside the get transaction');
  logic.getTransactions(req.currentAcno).then((result)=>{
    res.status(result.statusCode).json(result)
  })

})

server.delete('/delete-account',jwtMiddleware,(req,res)=>{
  console.log('inside the delete api');
  logic.deleteMyAccount(req.currentAcno).then((result)=>{
    res.status(result.statusCode).json(result)
  })
})