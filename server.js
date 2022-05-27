var jsforce = require('jsforce');
const express = require('express')
var fs = require('fs');
var path = require('path');
const app = express()

app.use(express.json())
//###################################### User CREDENTIAL.################################
//dev edition
let creds = JSON.parse(fs.readFileSync(path.resolve(__dirname, './SF_creds.json')).toString());

//######################################################### User authentification.################################
//###########################################Methode 1 : Users identification once and then initiate connection when http request

const authObject = new jsforce.OAuth2({
    loginUrl: creds.instanceURL+'.my.salesforce.com/',//*get from login page */
    ClientId : creds.clientID,
    clientSecret : creds.clientSecret,
    redirectUri : 'http://localhost:1000/myapi/token' 
});

//*****************************TESTED BUT PROB IN SCOPE or Redirecting
app.get("/myapi/auth/login", function(req, res) {
    // Redirect to Salesforce login/authorization page
    console.log("/myapi/auth/login worked, SF redirected me to login page that needs the token route")
    res.redirect(authObject.getAuthorizationUrl({scope: 'full'}));//check in app manager
  });
//i can access the redirecting url but...
//***************This error is in the auth callback: invalid_client_id: client identifier invalid */
app.get('/myapi/token', (req, res) => {
    console.log("inside /token")
    const connect = new jsforce.Connection({oauth2: authObject});
    
    connect.login(creds.username, creds.password, function(err, userInfo) {
    if (err) { return console.error(err); }
    const code = req.query.code;
    conn.authorize(code, function(err, userInfo) {
        if (err) { return console.error("This error is in the auth callback: " + err); }//******* */
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
  });
})
})
//########################################### Methode 2 : Users identification for each request
var conn = new jsforce.Connection({
    //loginUrl : 'https://anrpc.my.salesforce.com/'
    loginUrl: creds.instanceURL+'.my.salesforce.com/',
    ClientId : creds.clientID,
    clientSecret : creds.clientSecret,
    redirectUri : 'http://localhost:1000/myapi/token'
  });

//**************************** task 4 GET ALL ACCOUNTs Request
//SIMPLE QUERY
app.get('/myapi/accounts', (req, res) => {
conn.login(creds.username, creds.password, function(err, userInfo) {
  if (err) { return console.error(err); }
  let q = 'SELECT id, Site, name FROM account';
  conn.query(q, function(err, result1) {
    if (err) { return console.error(err); }
    res.send(result1)
    console.log("all account fetched")
  });
  
}); })
//************************************task 1 GET an account using the ID
app.get('/myapi/account/:accountID', (req, res) => {
    conn.login(creds.username, creds.password, function(err, userInfo) {
        if (err) { return console.error(err); }
        //0018a00001otYcUAAU
        conn.sobject("Account").retrieve(req.params.accountID, function(err, account) {
        if (err) { return console.error(err); }
        console.log("Name : " + account.Name);
  })
})
res.send(req.params)

})
   
//************************************Extra conditional fetch*/
app.get('/myapi/contact/BeforeYestrday', (req,res) => {
    conn.login(creds.username, creds.password, function(err, userInfo) {
        if (err) { return console.error(err); }
        conn.sobject("Contact")
        .select('*, Contact.*') // asterisk means all fields in specified level are targeted.
        .where("CreatedDate < YESTERDAY") // conditions in raw SOQL where clause.
        .execute(function(err, cont) {
            for (var i=0; i<cont.length; i++) {
                var contact = cont[i];
                console.log("Name: " + contact.Name);
    }
    res.send(cont)

    });
  })
})

//########################### task 3 update new element request 
app.put('/myapi/accounts/:accountID',(req,res)=>{
     
     //in postman
     //params: accountID = "0018a00001otYcUAAU"
     //body "Last_Name" : "El mhamid"
     //body { "Id" : '0018a00001otYcVAAU',         "Name" : "canada" }
    let    account = { 
        Id : req.body.Id,
        Name : req.body.Name
      }
    conn.login(creds.username, creds.password, function(err, userInfo) {
        if (err) { return console.error(err); }
       
        conn.sobject("Account").update(account , function(err, ret) {
            if (err || !ret.success) { return console.error(err, ret); }
            console.log('Updated Successfully : ' + ret.id);
            res.send(ret)
            // ...
          });
    })
})

//************************task 2 : Create a new element
app.post('/myapi/account',(req,res)=>{
    /*************in post body
     * 	{         "Id" : "0017000000hOMChAAO",
        "Name" : "created Account #1"    }
     */
   const p = req.body
       const record = {
            Id: p.Id,
            Name: p.Name         
       }
       conn.login(creds.username, creds.password, function(err, userInfo) {
        if (err) { return console.error(err); }
            console.log(record)
                // Single record creation
                conn.sobject("Account").create(record, function(err, ret) {
                if (err || !ret.success) { return console.error(err, ret); }
                console.log("Created record id : " + ret.id);
                })
});
    res.send(record)
  })
  
//*******************************Add multiple records 
  /*records = [
    { "Id" : "0017000000hOMChAAO", "Name" : "Updated Account #1" },
    { "Id" : "0017000000iKOZTAA4", "Name" : "Updated Account #2" }
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

//********************************TESTED
 //CONDITIONAL QUERY
 app.get('/myapi/contacts', (req, res) => {
    //i am logging eachtime manually and not using the authentif session info   

 conn.login(creds.username, creds.password, function(err, userInfo) {
   if (err) { return console.error(err); }
   console.log("SOQL FITCH RESULT")
   let  q = "SELECT Id, Name, CreatedDate FROM Contact WHERE CreatedDate >= YESTERDAY ORDER BY CreatedDate DESC, Name ASC LIMIT 5 OFFSET 10"
   conn.query(q, function(err, result2) {
     if (err) { return console.error(err); }
     //console.log(result2);
     res.send(result2)
   });
   
 }); })

// ******************************************task 3 UPDATE Opportunity with parameters
// SET CloseDate = '2013-08-31'
// WHERE Account.Name = 'Salesforce.com'
app.get("myapi/candidate/search/:name", (req,res) => {

    conn.login(creds.username, creds.password, function(err, userInfo) {
        if (err) { return console.error(err); }
            conn.sobject("Account")
            .find({ Name: 'canada'  }) // "fields" argument is omitted
            .execute(function(err, records) {
            if (err) { return console.error(err); }
            console.log(records);
            
            res.send(records)
            });
})
})

//****************************Extra task log in */
app.get('/myapi/',(req,res) =>{
    conn.login(creds.username, creds.password, function(err, userInfo) {
        if (err) { return console.error(err); }
        console.log("User ID: " + userInfo.id); 
        console.log("Org ID: " + userInfo.organizationId); 
        console.log("Access token: " + conn.accessToken); 
        console.log("Instance URL: " + conn.instanceUrl);
        res.send(userInfo)
    })
    
})

// ***************************************Extra task to delete an element
//"00001009"
app.delete('/myapi/cases/:caseID', (req,res) => {
    conn.login(creds.username, creds.password, function(err, userInfo) {
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
}) 
    

//**************************************Single record deletion
//must delete case with number and opportunity with names
// ***************************************TESTED
/*
app.delete('/myapi/accounts/:accountID', (req,res) => {
     //i am logging eachtime manually and not using the authentif session info   

conn.login(creds.username, creds.password, function(err, userInfo) {
    if (err) { return console.error(err); }
       console.log(" inside delete sobject")

       conn.sobject("Account").destroy(req.params.accountID, function(err, ret) {
           if (err || !ret.success) { return console.error(err, ret); }
           console.log('Deleted Successfully : ' + ret.id);
       });
   })
})

*/
//**************************************Multiple record deletion
/*app.delete('/myapi/accounts', (req,res) => {
    conn.login(creds.username, creds.password, function(err, userInfo) {
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

 // ***************************************TESTED
/*
    conn.login(creds.username, creds.password, function(err, userInfo) {
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





//***************************************************************************** */
//HTTP REQUESTS
//CRUD
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