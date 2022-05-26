var jsforce = require('jsforce');
const express = require('express')
const app = express()

app.use(express.json())

//normal user production edition
const Nusername = 'gy_elmhamid-d3hc@force.com'
const Npassword = 'Astaghfirullah00W1UsqkqDGV63JzcUXHO459ZK' //pw+secToken

//dev edition
const username = 'yara_elmhamid@soljit.com'
const password = 'Astaghfirullah00zrOmdw4gerCKoN37qZ2bFqH1' //pw+secToken
const clientID = '3MVG9FMtW0XJDLd0N5pIRGGTmB5L9gIAwRcHcb6sJ6Sq6o7byO3QGcsZn8_SqzpigJF2If8WaC6iy3bntvyX7'
const clientSecret = '628B59237DD973AD77ADE212614680026E6C27970F7F38E24A0EC1D94C007284'
const token = "zrOmdw4gerCKoN37qZ2bFqH1"

var conn = new jsforce.Connection({
  // you can change loginUrl to connect to sandbox or prerelease env.
  //loginUrl : 'https://anrpc.my.salesforce.com/'
  loginUrl: 'https://soljit117-dev-ed.my.salesforce.com/',//*get from login page */
  ClientId : clientID,
  clientSecret : clientSecret,
  //redirectUri : 'http://localhost:' + port +'/token'
  redirectUri : 'http://localhost:1000/zrOmdw4gerCKoN37qZ2bFqH1'
});

//Connection code without GET HTTP request
//Username and Password Login

conn.login(username, password, function(err, acc) {
  if (err) { return console.error(err); }
  conn.query('SELECT Id, Name FROM Account', function(err, acc) {
    if (err) { return console.error(err); }
    console.log("authentification worked, and here is  response of it")
    console.log(acc);
  });
});



//***************************************************************************** */
//HTTP REQUESTS
//User authentification
/*app.get('/forceapi/authen', (req,res) => {
  conn.login(username, password, function(err, res) {
    if (err) { return console.error(err); }
    conn.query('SELECT Id, Name FROM Account', function(err, user) {
      if (err) { return console.error(err); }
      console.log(user);
    });
  });
  res.send(user)
})
//CRUD
//1. Retreive records using their IDs
//Record Detail page
// Single record retrieval

recordExample = "0017000000hOMChAAO"
app.get('/forceapi/record/detail/:recordID', (req, res) => {
  conn.sobject("Account").retrieve(req.params.id , function(err, account) {
    if (err) { return console.error(err); }
    console.log("Name : " + account.Name);
    // ...
  })
  res.send(account.Name)
})
// Multiple record retrieval


//2. Create Records
app.post('/forceapi/records',(req,res)=>{
  
  courses.push(record)
  res.send(record)
})*/
/*
conn.login(username, password, function(err, userInfo) {
    if (err) { return console.error(err); }
    // Now you can get the access token and instance URL information.
    // Save them to establish connection next time.
    console.log(conn.accessToken);
    console.log(conn.instanceUrl);
    // logged in user property
    console.log("User ID: " + userInfo.id);
    console.log("Org ID: " + userInfo.organizationId);
    // ...
  });*/
  /*
  var records = [];
conn.query("SELECT Id, Name FROM Account", function(err, result) {
  if (err) { return console.error(err); }
  console.log("total : " + result.totalSize);
  console.log("fetched : " + result.records.length);
});*/
/*conn.query("SELECT Id, Name FROM Account LIMIT 10", function(err, res) {
    if (err) { return handleError(err); }
    handleResult(res);
  });*/

  const port = process.env.PORT || 1000
app.listen(port, ()=>{
    console.log(`im listenign on port ${port}`)
})