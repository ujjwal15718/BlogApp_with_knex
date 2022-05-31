const router = require("express").Router()
const environment=require('../knexfile')
const knex=require('knex')(environment['development'])
const { verifyToken } = require('../middleware/auth.middleware');

router.post("/poststatus", verifyToken, async(req, res)=>{
    const {write_status} = req.body
    try {
        const userdata = await knex("users_data").where({id:req.id})
        console.log(userdata)
        await knex("user_post").insert({
            write_status,
            email:userdata[0].email
        })
        
        res.json({
            status:"success",
            msg:"status posted"
        })
    } catch (error) {
        
    }
})

router.post("/likedislikepost/:id", verifyToken, async (req, res)=>{
    const {like=false, dislike=false} = req.body
    const post_id = req.params.id
    if((like && dislike)){
        res.status(400).send("not valid")
    }
    try {
        const userdata = await knex("users_data").where({id:req.id})
        const email = userdata[0].email

        const post = await knex("like_dislike").where({email, post_id})
        if(post.length === 0){
            await knex("like_dislike").insert({
                email,
                post_id,
                like, dislike
            })
        }
        await knex("like_dislike").where({email, post_id}).update({
            like,
            dislike
        })
        res.send("reacted")
    } catch (error) {
        
    }
})

router.get("/totalreaction/:id", async(req, res)=>{
    try {
        const postdata = await knex('like_dislike').where({post_id: req.params.id})
        let likes = 0
        let dislikes = 0
        if(postdata.length === 0) return res.status(400).send("post doesn't exisit");
        for(let data of postdata){
            likes += data.like
            dislikes += data.dislike
        }
        res.send({
            postId:req.params.id,
            likes, dislikes
        })
    } catch (error) {
        res.status(500).json({
            status:"error",
            msg:"error while getting reaction:"+error.message
        })
    }
})
module.exports = router