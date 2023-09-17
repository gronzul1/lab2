//https://docs.amplify.aws/guides/functions/dynamodb-from-js-lambda/q/platform/js/#getting-an-item-by-primary-key-in-dynamodb-from-lambda

// gr-getUsers
// Nodejs 16.x

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const params = {
  TableName : 'users'
}

exports.handler = async (event, context) => {
  try {
    const data = await docClient.scan(params).promise()
    return { 
      body: JSON.stringify(data) ,
      headers: "Access-Control-Allow-Origin=*"
    }
  } catch (err) {
    return { error: err }
  }
}