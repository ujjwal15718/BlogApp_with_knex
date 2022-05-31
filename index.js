const express=require('express');
const app=express();
port=4000;
app.use(express.json())

app.use(require('./routes/user.router'))
app.use(require('./routes/post.router'))

 


app.listen(port,()=>{
    console.log("success-fully done")
})