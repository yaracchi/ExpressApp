const express = require('express')
const app = express()
//define route
//when have http get request to / apply callback fucntion
app.get('/', (req, res) => {
        res.send('hello world!!!!')
})
app.get('/api/courses', (req, res) => {
    //get the data from database usually
    res.send([1,2,3])
})

app.listen(3000, ()=>{
    console.log("im listenign on port 3000")
})