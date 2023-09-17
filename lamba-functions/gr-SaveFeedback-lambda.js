//https://docs.amplify.aws/guides/functions/dynamodb-from-js-lambda/q/platform/js/#getting-an-item-by-primary-key-in-dynamodb-from-lambda

// gr-SaveFeedback-lambda
// Nodejs 16.x
var a = 
{
  "feeebackDate":1694779981472,
  "productId": 101,
  "productName":"Test Prod1",
  "rating":"5"
}

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "gr-feedback";

exports.handler = async (event) => {
  try {
    const params = {
      TableName: tableName,      
      Item: {
        feeebackDate: event.feeebackDate,
        productId: event.productId,
        productName:event.productName,
        rating: event.rating
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