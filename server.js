var jsforce = require('jsforce');
const express = require('express')
const app = express()

app.use(express.json())
const username = 'gy_elmhamid-d3hc@force.com'
const password = 'Astaghfirullah00'

var conn = new jsforce.Connection({
    // you can change loginUrl to connect to sandbox or prerelease env.
    loginUrl : 'https://anrpc.my.salesforce.com/'
  });
//Connection
//Username and Password Login

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
  });
  var records = [];
conn.query("SELECT Id, Name FROM Account", function(err, result) {
  if (err) { return console.error(err); }
  console.log("total : " + result.totalSize);
  console.log("fetched : " + result.records.length);
});
/*conn.query("SELECT Id, Name FROM Account LIMIT 10", function(err, res) {
    if (err) { return handleError(err); }
    handleResult(res);
  });*/