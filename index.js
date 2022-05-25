const express = require('express')
const app = express()

const courses = [
    {id:1, name: 'course1'},
    {id:2, name: 'course2'}    ,
    {id:3, name: 'course3'}    ,
    {id:4, name: 'course4'}

]
//***********define route
//when have http get request to / apply callback fucntion
app.get('/', (req, res) => {
        res.send('HOME PAGE')
})

//get courses list
app.get('/api/courses', (req, res) => {
    //get the data from database usually
    res.send(courses)
})

//get a course with a given ID if exists
app.get('/api/courses/:id', (req, res) => {
    //get the data from database usually
    let course = courses.find( elem => elem.id === parseInt(req.params.id))//cuz return '1' not 1
    if(!course){ //ressource not found
        res.status(404).send('the course was not found')
    }
    res.send(course)
})
//create new course with POST
app.post('/api/courses',(req,res)=> {
const course = {
    id: courses.length + 1,
    name : req.body.name
}
})

/****
 //**********route parameters
app.get('/api/posts/:year/:month/:day', (req, res) => {
    //get the data from database usually
    res.send(req.params)
})

app.get('/api/posts/:name', (req, res) => {
    //get the data from database usually
    res.send(req.params.name)
})

//********** query params 
app.get('/api/posts/:year/:month', (req, res) => {
    //get the data from database usually
    res.send(req.query)
})
 */


//port assigning 
const port = process.env.PORT || 1000
app.listen(port, ()=>{
    console.log(`im listenign on port ${port}`)
})