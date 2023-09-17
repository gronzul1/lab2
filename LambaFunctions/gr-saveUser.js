//https://docs.amplify.aws/guides/functions/dynamodb-from-js-lambda/q/platform/js/#getting-an-item-by-primary-key-in-dynamodb-from-lambda

// gr-saveUser
// Nodejs 16.x
// var a = {
//   "userId": 101,
//   "department":"XXX",
//   "email": "YYY@ZZZ",
//   "firstName": "Giuseppe",
//   "lastName": "R.",
//   "location": "ITALY",
//   "personalid": "123-XX44"
// }

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "users";

exports.handler = async (event) => {
  try {
    const params = {
      TableName: tableName,
      // event: event,
      Item: {
        userId: event.userId,
        department: event.department,
        email: event.email,
        firstName: event.firstName,
        lastName: event.lastName,
        location: event.location,
        personalid: event.personalid,
      },
    };

    await docClient.put(params).promise();
    return {
      body: "Successfully created item!",
      headers: "Access-Control-Allow-Origin=*"
    };
  } catch (err) {
    return { error: err };
  }
};



