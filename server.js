const express = require('express');
const app = express()

const routes = require('./routes')

/* @port  This will specify ports */
let port = process.env.PORT || 3000;

app.use('/api/v1', routes)

app.listen(port, ()=>{
  console.log(`server is listening on port ${port}`)
})  
