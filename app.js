const express = require('express')
const app = express()

app.get('/', (req,res)=>{
    res.send("This should never show")
})

app.listen(3000)