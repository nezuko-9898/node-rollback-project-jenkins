const express = require('express')
const app = express()

// 🔥 Intentional crash
throw new Error("ROLLBACK TEST ERROR")

app.get('/', (req,res)=>{
    res.send("This should never show")
})

app.listen(3000)