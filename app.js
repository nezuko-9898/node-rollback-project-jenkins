throw new Error("Testing rollback error in release-7");
const express = require('express')
const app = express()

app.get('/', (req,res)=>{
    res.send("Node App Running Successfully")
})

app.listen(90000, ()=>{
    console.log("Server running on port 90000")
})