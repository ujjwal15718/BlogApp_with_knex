const router = require("express").Router()
const environment=require('../knexfile')
const knex=require('knex')(environment['development'])
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs');
const { verifyToken } = require('../middleware/auth.middleware');



router.get('/signup',async(req,res)=>{
    const{email,name,id,password}=req.body
   try{
        if(!(email && name && password)){
            return res.send("please fill all the inputs")
        }

       const salt=await bcrypt.genSalt(8)
       const hashpass=await bcrypt.hash(password,salt)
       const data =await knex('users_data').insert({...req.body,password:hashpass})
       res.send(data)
   }
   catch(err){
        res.send(err.message)
   }
})

router.post('/login',async(req,res)=>{
    const {email, password}=req.body
    try{
        const data=await knex('users_data').where({email})
        if(data.length===0){
            return res.send("user doesn't exist")
        }
        const passMatch=await bcrypt.compare(password,data[0].password)
        if(passMatch){
            const token=jwt.sign({id:data[0].id},'ujjwal')
            res.cookie("token",token).send(data)

        }
        else{
            res.send("something wrong")
        }
    }
    catch(err){
        console.log(err.message)
        res.send(err.message)
    }
})

router.get("/check",verifyToken,async(req,res)=>{
    const sponce=await knex("users_data").where({id:req.id})
    res.send(`welcome, ${sponce[0].name} to protected route`)
})

router.put('/status_check/:id',async(req,res)=>{
    try{
        const data=await knex('users_data').where({'id':req.params.id}).update(req.body)
        res.send("updated!!!!!!!!!!!!")
    }
    catch(err){
        res.send(err.message)
    }
})

router.put('/post_data',async(req,res)=>{
    const {email}=req.body
    try{
        const data=await knex('users_data').where({email})
        if(data.length===0){
            return res.send("user doesn't exist")
            
        }
        else{
            const data=await knex('user_post').insert(req.body)
            res.send("done")
        }
    }
    catch(err){
        res.send(err.message)
    }
})
 
 



module.exports = router