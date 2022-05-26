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

//###################################### User authentification.################################
//GET HTTP request to Login information retreiving
app.get('/forceapi/auth', (req, res) => {
  conn.login(username, password, function(err, userInfo) {
    if (err) { return console.error(err); }
    // Now you can get the access token and instance URL information.
    // Save them to establish connection next time.
    //console.log("Access token: " + conn.accessToken);
    //console.log("Instance URL token: " + conn.instanceUrl);
    // logged in user property
    //console.log("User ID: " + userInfo.id);
    //console.log("Org ID: " + userInfo.organizationId);

    res.send(userInfo); //inside login
  });
})


//###################################### SOQL:  Fetch Account's records.################################
//using SOQL connexion#query(soql, callbackopt)

//SIMPLE QUERY
app.get('/forceapi/Records1', (req, res) => {
conn.login(username, password, function(err, userInfo) {
  if (err) { return console.error(err); }
  console.log("SOQL FITCH RESULT")
  let q = 'SELECT id, Site, name FROM account LIMIT 2';
  conn.query(q, function(err, result1) {
    if (err) { return console.error(err); }
    //console.log("total : " + result1.totalSize);
    //console.log("fetched : " + result1.records.length);
    //console.log(result1);
    res.send(result1)
  });
  
}); })

 //CONDITIONAL QUERY
app.get('/forceapi/Records2', (req, res) => {
  conn.login(username, password, function(err, userInfo) {
    if (err) { return console.error(err); }
    console.log("SOQL FITCH RESULT")
    let  q = "SELECT Id, Name, CreatedDate FROM Contact WHERE CreatedDate >= YESTERDAY ORDER BY CreatedDate DESC, Name ASC LIMIT 5 OFFSET 10"
    conn.query(q, function(err, result2) {
      if (err) { return console.error(err); }
      //console.log(result2);
      res.send(result2)
    });
    
  }); })
//############################## Query Method-Chain(JSON): Fetch Contact's records.################################
//using SObject#find(conditions, fields), you can do query in JSON-based condition expression 

conn.login(username, password, function(err, userInfo) {
  if (err) { return console.error(err); }
  //console.log("JSON FITCH RESULT")
  conn.sobject("Contact").find(
    // conditions in JSON object
    {  CreatedDate: { $gte : jsforce.Date.YESTERDAY }},
    // fields in JSON object
    { Id: 1,
      Name: 1,
      CreatedDate: 1 }
  )
  .sort({ CreatedDate: -1, Name : 1 })
  .limit(5)
  .skip(10)
  .execute(function(err, records) {
    if (err) { return console.error(err); }
    //console.log("fetched : " + records.length);
  });
})

//***************************************************************************** */
//HTTP REQUESTS
//CRUD
//1. Retreive record from Account using an ID
//Record Detail page
/*recordExample = "0018a00001otYcdAAE"
app.get('/forceapi/record/detail/:recordID', (req, res) => {
  conn.sobject("Account").retrieve(parseInt(req.params.recordID) , function(err, account) {
    if (err) { return console.error(err); }
    console.log("Name : " + account.Name);
    // ...
  })
  res.send(res)
})*/
// Multiple record retrieval

/*
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