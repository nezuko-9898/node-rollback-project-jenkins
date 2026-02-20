const express = require('express')
const app = express()

throw new Error("ROLLBACK TEST ERROR")

app.get('/', (req,res)=>{
    res.send("This should never show")
})

app.listen(3000)