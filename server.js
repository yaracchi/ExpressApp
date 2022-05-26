var jsforce = require('jsforce');
const express = require('express')
const app = express()

app.use(express.json())
//###################################### User CREDENTIAL.################################

//normal user production edition
const Nusername = 'gy_elmhamid-d3hc@force.com'
const Npassword = 'Astaghfirullah00JCekzKW2C7Gmofzc5ciAHFAbb' //pw+secToken

//dev edition
const username = 'yara_elmhamid@soljit.com'
const password = 'Astaghfirullah00JCekzKW2C7Gmofzc5ciAHFAbb' //pw+secToken
const clientID = '3MVG9FMtW0XJDLd0N5pIRGGTmB5L9gIAwRcHcb6sJ6Sq6o7byO3QGcsZn8_SqzpigJF2If8WaC6iy3bntvyX7'
const clientSecret = '628B59237DD973AD77ADE212614680026E6C27970F7F38E24A0EC1D94C007284'
const token = "JCekzKW2C7Gmofzc5ciAHFAbb"
const instanceURL = 'https://soljit117-dev-ed'

//###################################### User authentification.################################
var conn = new jsforce.Connection({
  // you can change loginUrl to connect to sandbox or prerelease env.
  //loginUrl : 'https://anrpc.my.salesforce.com/'
  loginUrl: instanceURL+'.my.salesforce.com/',
  ClientId : clientID,
  clientSecret : clientSecret,
  //redirectUri : 'http://localhost:' + port +'/token'
  redirectUri : 'http://localhost:1000/JCekzKW2C7Gmofzc5ciAHFAbb'
});

//jsForce connection
const authObject = new jsforce.OAuth2({
    // you can change loginUrl to connect to sandbox or prerelease env.
    //loginUrl : 'https://anrpc.my.salesforce.com/'
    loginUrl: 'https://soljit117-dev-ed.my.salesforce.com/',//*get from login page */
    ClientId : clientID,
    clientSecret : clientSecret,
    //redirectUri : 'http://localhost:' + port +'/token'
    redirectUri : 'http://localhost:1000/myapi/token'
});

//*****************************TESTED BUT PROB IN SCOPE
app.get("/myapi/auth/login", function(req, res) {
    // Redirect to Salesforce login/authorization page
    console.log("/myapi/auth/login worked, SF redirected me to login page that needs the token route")
    res.redirect(authObject.getAuthorizationUrl({scope: 'api id web'}));//will require a connection, we must have a token route
  });
//**********************NOT Working */
//GET HTTP request to Login information retreiving
app.get('/myapi/token', (req, res) => {
    console.log("inside /token")
    const conn = new jsforce.Connection({oauth2: authObject});
    
    conn.login(username, password, function(err, userInfo) {
    if (err) { return console.error(err); }
    //we parse out the code that Salesforce sent back to the /token url when it returned us from the login
    const code = req.query.code;
    // once you’ve logged in and been redirected to the token route, you should see something
    // like ‘http://localhost:3030/token?query=longhashedoutstringxyz’.
    conn.authorize(code, function(err, userInfo) {
        if (err) { return console.error("This error is in the auth callback: " + err); }
        // Now you can get the access token and instance URL information.
        console.log('Access Token: ' + conn.accessToken);
        console.log('Instance URL: ' + conn.instanceUrl);
        console.log('refreshToken: ' + conn.refreshToken);
        // logged in user property
        console.log('User ID: ' + userInfo.id);
        console.log('Org ID: ' + userInfo.organizationId);
        // Save them to establish connection next time.
        //SF will return some connection information that we will store as session variables to
        // use every time we make a new handshake with SF for the calls from each route
        req.session.accessToken = conn.accessToken;
        req.session.instanceUrl = conn.instanceUrl;
        req.session.refreshToken = conn.refreshToken;
    //redirect to the login page of SF

    res.send("authentification succeded");
    //res.send(userInfo); //inside login
  });
})
})
//#############################if sessions auth works
/***
 * app.get('/api/accounts', function(req, res) {
// if auth has not been set, redirect to index
    if (!req.session.accessToken || !req.session.instanceUrl) { res.redirect('/'); }
//SOQL query
    let q = 'SELECT id, name FROM account LIMIT 10';
//instantiate connection
    let conn = new jsforce.Connection({
        oauth2 : {oauth2},
        accessToken: req.session.accessToken,
        instanceUrl: req.session.instanceUrl
   });
//set records array
    let records = [];
    let query = conn.query(q)
       .on("record", function(record) {
         records.push(record);
       })
       .on("end", function() {
         console.log("total in database : " + query.totalSize);
         console.log("total fetched : " + query.totalFetched);
         res.json(records);
       })
       .on("error", function(err) {
         console.error(err);
       })
       .run({ autoFetch : true, maxFetch : 4000 });
});
 */
//###################################### SObject: #retrieve(id) GET/Fetch Account's record.#################


//###################################### SOQL:  GET/Fetch Account's records.################################
//using SOQL connexion#query(soql, callbackopt)

//**********************TESTED
//SIMPLE QUERY
app.get('/myapi/account', (req, res) => {
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

//********************************TESTED
 //CONDITIONAL QUERY
app.get('/myapi/contacts', (req, res) => {
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
//############################## Query Method-Chain(JSON): GET/Fetch Contact's records.###############
//using SObject#find(conditions, fields), you can do query in JSON-based condition expression 
/*conn.login(username, password, function(err, userInfo) {
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
})*/


//###################################### SOQL:  POST/add records.################################
//how to do post in web url
/*app.post('/myapi/account',(req,res)=>{
   const p = req.body
    //parse request body to create record object for SF
       let record = {
            AccountId: p.Id,
            Name: p.Name         
       }
       //must conn.login**********************
   console.log(records)
    conn.sobject("Account").create(records,
      function(err, rets) {
        if (err) { return console.error(err); }
        for (var i=0; i < rets.length; i++) {
          if (rets[i].success) {
            console.log("Created record id : " + rets[i].id);
          }
        }});
    records.push(records)
    res.send(records)
  })*/
  //*******************************Add/update Single record update
  /*conn.login(username, password, function(err, userInfo) {
    if (err) { return console.error(err); }
        console.log(" inside update sobject")

        conn.sobject("Account").update({ 
        Id : '0017000000hOMChAAO',
        Name : 'Updated Account #1'
    }, function(err, ret) {
        if (err || !ret.success) { return console.error(err, ret); }
        console.log('Updated Successfully : ' + ret.id);
        // ...
    })
})*/
//*******************************Add/update multiple */
  /*records = [
    { Id : '0017000000hOMChAAO', Name : 'Updated Account #1' },
    { Id : '0017000000iKOZTAA4', Name : 'Updated Account #2' }
  ]
  console.log(records)
 conn.sobject("Account").update(records,
  function(err, rets) {
    if (err) { return console.error(err); }
    for (var i=0; i < rets.length; i++) {
      if (rets[i].success) {
        console.log("Updated Successfully : " + rets[i].id);
      }
    }
  });*/

// ******************************************UPDATE Opportunity with parameters
// SET CloseDate = '2013-08-31'
// WHERE Account.Name = 'Salesforce.com'
/*conn.sobject('Opportunity')
    .find({ 'Account.Name' : 'Salesforce.com' })
    .update({ CloseDate: '2013-08-31' }, function(err, rets) {
      if (err) { return console.error(err); }
      console.log(rets);
      // ...
    });*/

//###################################### SOQL:  Delete records.################################

//**************************************Single record deletion

//must delete case with number and opportunity with names
//*****************************************TESTED */
// ***************************************TESTED
app.delete('/myapi/accounts/:accountID', (req,res) => {
conn.login(username, password, function(err, userInfo) {
    if (err) { return console.error(err); }
       console.log(" inside delete sobject")

       conn.sobject("Account").destroy(req.params.accountID, function(err, ret) {
           if (err || !ret.success) { return console.error(err, ret); }
           console.log('Deleted Successfully : ' + ret.id);
       });
   })
})
// ***************************************TESTED
//"00001009"
/*
app.delete('/myapi/cases/:caseID', (req,res) => {
    conn.login(username, password, function(err, userInfo) {
        if (err) { return console.error(err); }
           console.log(" inside delete sobject")
   
           conn.sobject('Case')
       .find({ CaseNumber : req.params.caseID })
       .destroy(function(err, rets) {
         if (err) { return console.error(err); }
         console.log(rets);
         // ...
         res.send(rets)
       });
       })
}) */
    
 // ***************************************TESTED
/*
    conn.login(username, password, function(err, userInfo) {
        if (err) { return console.error(err); }
           console.log(" inside delete sobject")
   
           conn.sobject('Opportunity')
       .find({ Name : "GenePoint SLA"})
       .destroy(function(err, rets) {
         if (err) { return console.error(err); }
         console.log(rets);
         // ...
       });
       })*/

//**************************************Multiple record deletion
/*app.delete('/myapi/cases/:caseID', (req,res) => {
    conn.login(username, password, function(err, userInfo) {
        if (err) { return console.error(err); }
           console.log(" inside delete sobject")
            
            conn.sobject("Account").del([ // synonym of "destroy"
            '0017000000hOMChAAO',
            '0017000000iKOZTAA4'
            ], 
            function(err, rets) {
            if (err) { return console.error(err); }
            for (var i=0; i < rets.length; i++) {
                if (rets[i].success) {
                console.log("Deleted Successfully : " + rets[i].id);
                }
            }
            });
    })
})*/



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
    console.log(`im listening on port ${port}`)
})