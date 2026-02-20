const express = require('express')
const app = express()

// ❌ INTENTIONAL ERROR (for testing rollback)
throw new Error("TEST ERROR - RELEASE 7 FAILED")

app.get('/', (req,res)=>{
    res.send("Node App Running Successfully ok not problem")
})


})