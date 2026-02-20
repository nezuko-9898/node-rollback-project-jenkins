const express = require('express')
const app = express()

app.get('/', (req,res)=>{
    res.send("Node App Running Successfully hiii hell")
})

app.listen(90000, () => {
    console.log("Server running on port 3000")
})