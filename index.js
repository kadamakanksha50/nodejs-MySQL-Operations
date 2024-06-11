const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const server = express()
server.use(cors())
server.use(bodyParser.json())

const PORT = 8000
server.listen(PORT,()=>{
    console.log('Server started running on port ' +PORT);
})
    //1. Creating the connection from node.js to mySQL database
const con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'mysqlNodeJS' 
})
con.connect((err)=>{
    if(err){
        console.error("Error:"+err.stack);
        return;
    }
    console.log("Connected to database:"+con.threadId);
})

server.post('/api/login',(req,res)=>{
    const postData =req.body
    const sql='SELECT * FROM login WHERE Username=? AND Password=?'
    const data=[postData.user, postData.pass]
    con.query(sql,data,(err,result)=>{
        if(err){
            res.json({status:false,message:'Internal server error !!'})
        }
        else{
            if(result.length>=1){
                res.json({status:true,message:'Login Successful !!'})
            }else{
                res.json({status:true,message:'Wrong credentials !!'})
            }
        }
    })
})

server.get('/api/validationEmail/:emailID',(req,res)=>{
    const email = req.params.emailID
    const sql = 'SELECT * FROM user WHERE EmailID=?'
    const data = [email]
    con.query(sql,data,(err,result)=>{
        if(err){
            res.json({status:false, message:'Internal server error'})
        }
        else{
            if(result.length>=1){
                res.json({status:true,message:'Email already exists'})
            }
            else{
                res.json({status:true,message:'new'})
            }
        }
    })
})

server.get('/api/user',(req,res)=>{

    const sql = 'SELECT * FROM user';
    con.query(sql,(err,result)=>{
        if(err){
            res.json({status:false,message:'Retrieval Error'})
        }
        else{
            res.json({status:true,message:result})
        }
    })
})

server.put('/api/update/:srno',(req,res)=>{
    const SrNo = req.params.srno
    const postData = req.body
    const sql = 'UPDATE user SET FullName=?, EmailID=?, Contact=?, City=?, Gender=? WHERE SrNo=?'
    const data = [postData.fullName, postData.emailID, postData.contact, postData.city, postData.gender,SrNo]
    con.query(sql,data,(err,result)=>{
        if(err){
            res.json({status:false, message:'Internal server error'})
        }
        else{
            res.json({status:true,message:'Details updated successfully !!'})
        }
    })
})

server.delete('/api/delete/:srno',(req,res)=>{
    const SrNo = req.params.srno
    const postData = req.body
    const sql = 'DELETE FROM user WHERE SrNo=?'
    const data = [SrNo]
    con.query(sql,data,(err,result)=>{
        if(err){
            res.json({status:false, message:'Internal server error'})
        }
        else{
            res.json({status:true,message:'Details deleted successfully !!'})
        }
    })
})

server.post('/api/insert',(req,res)=>{
    //2.Retrieving data from request
    const formData = req.body

    //3.Executing the query with data
    const query = "INSERT INTO user(FullName, EmailID, Contact, City, Gender) VALUES(?,?,?,?,?);";
    const data = [formData.fullName, formData.emailID, formData.contact, formData.city, formData.gender]
    con.query(query,data,(err,result)=>{
            
        //4.Sending the response with respect to the operation

        if(err){
            console.error('Error:'+err.stack)
            res.json({status:false,message:'Error:'+err.stack})
            return;
        }
        res.json({status:true,message:'Details added successfully !!'})
    })
    
})