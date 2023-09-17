"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignS3Policy = exports.enableWebSite = exports.allowPublic = exports.createS3 = exports.deleteS3 = exports.listS3 = exports.insertProductsFile = exports.insertUsersFile = exports.MakeFeedbackTable = exports.MakeProductTable = exports.createFeedbackTable = exports.createProductTable = exports.ListTables = exports.attachRolePolicy = exports.deleteRole = exports.createRole = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const client_iam_1 = require("@aws-sdk/client-iam");
const client_s3_1 = require("@aws-sdk/client-s3"); // ES Modules import
const client_lambda_1 = require("@aws-sdk/client-lambda");
const fs = require("fs");
const path = require("path");
const REGION = "us-east-1";
const s3 = new client_s3_1.S3Client({ region: REGION });
const ddb = new client_dynamodb_1.DynamoDB({ region: REGION });
const iam = new client_iam_1.IAMClient({});
const lmbd = new client_lambda_1.LambdaClient({});
const RoleName = "gr-getData-role";
const BucketName = "gr-feedback-bucket";
const LambdaName = "gr-GetData-lambda";
const ddbFullPolicy = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess";
const TableName = "gr-products";
const TableName2 = "gr-feedback";
const apiGateway = 'gr-auth-api';
//#region  Sequence
// through the aws cli
//STEP IAM:     Create user gr-dev for enable vsCode CLI
//STEP IAM:     Create Role and Attach policy
//STEP S3:      Create S3 bucket, allowPublic, assignS3Policy , enable static WebSite
//STEP DYNAMODB: Create Tables Products and Feedback and fill Products table with csv file
//through the aws console
//STEP LAMBDA:  Create lambda functions 
//STEP API GW:  Create APIGateway with 2 resource and method POST to retrieve data and PUT to save data
//STEP CODING WEB APP: Create Angular web app that expose web pages for user interaction
//STEP PUBBLCAZIONE WEB APP su S3: copy of the web app build in the S3Bucket
//STEP PUBBLICAZIONE con CloudFront: create Cloudfront to expose web app
//#endregion
//#region fx IAM
const createRole = async (roleName) => {
    console.log("createRole...");
    const command = new client_iam_1.CreateRoleCommand({
        AssumeRolePolicyDocument: JSON.stringify({
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Principal: {
                        Service: "lambda.amazonaws.com",
                    },
                    Action: "sts:AssumeRole",
                },
            ],
        }),
        RoleName: roleName,
    });
    return await iam.send(command);
};
exports.createRole = createRole;
const deleteRole = async (roleName) => {
    console.log("deleteRole...");
    const command = new client_iam_1.DeleteRoleCommand({ RoleName: roleName });
    return await iam.send(command);
};
exports.deleteRole = deleteRole;
const attachRolePolicy = async (policyArn, roleName) => {
    console.log("attachRolePolicy...");
    const command = new client_iam_1.AttachRolePolicyCommand({
        PolicyArn: policyArn,
        RoleName: roleName,
    });
    return await iam.send(command);
};
exports.attachRolePolicy = attachRolePolicy;
//#endregion
//#region fx DynamoDB
const ListTables = async () => {
    console.log("ListTables...");
    const input = {};
    const command = new client_dynamodb_1.ListTablesCommand(input);
    return await ddb.send(command);
};
exports.ListTables = ListTables;
const createProductTable = async () => {
    console.log("createProductTable...");
    const input = {
        "AttributeDefinitions": [
            {
                "AttributeName": "ProductId",
                "AttributeType": "N"
            },
            {
                "AttributeName": "ProductName",
                "AttributeType": "S"
            }
        ],
        "KeySchema": [
            {
                "AttributeName": "ProductId",
                "KeyType": "HASH"
            },
            {
                "AttributeName": "ProductName",
                "KeyType": "RANGE"
            }
        ],
        "ProvisionedThroughput": {
            "ReadCapacityUnits": 5,
            "WriteCapacityUnits": 5
        },
        "TableName": TableName
    };
    const command = new client_dynamodb_1.CreateTableCommand(input);
    return await ddb.send(command);
};
exports.createProductTable = createProductTable;
const createFeedbackTable = async () => {
    console.log("createFeedbackTable...");
    const input = {
        "AttributeDefinitions": [
            {
                "AttributeName": "feeebackDate",
                "AttributeType": "N"
            },
            {
                "AttributeName": "productName",
                "AttributeType": "S"
            }
        ],
        "KeySchema": [
            {
                "AttributeName": "feeebackDate",
                "KeyType": "HASH"
            },
            {
                "AttributeName": "productName",
                "KeyType": "RANGE"
            }
        ],
        "ProvisionedThroughput": {
            "ReadCapacityUnits": 5,
            "WriteCapacityUnits": 5
        },
        "TableName": TableName2
    };
    const command = new client_dynamodb_1.CreateTableCommand(input);
    return await ddb.send(command);
};
exports.createFeedbackTable = createFeedbackTable;
const MakeProductTable = async () => {
    const input = {
        TableName: TableName,
    };
    (0, exports.createProductTable)().then(data => {
        console.log(input.TableName + " table created!");
        // console.log(data.TableDescription.TableStatus);
        if (data.TableDescription.TableStatus != "ACTIVE") {
            const command = new client_dynamodb_1.DescribeTableCommand(input);
            const handle = setInterval(async () => {
                console.log('check TableStatus');
                const esponse = await ddb.send(command).then(data => {
                    console.log(data.Table.TableStatus);
                    //"TableStatus"
                    if (data.Table.TableStatus == "ACTIVE") {
                        clearInterval(handle); // stops intervals                        
                        (0, exports.insertProductsFile)();
                    }
                });
            }, 2000);
        }
    });
};
exports.MakeProductTable = MakeProductTable;
const MakeFeedbackTable = async () => {
    const input = {
        TableName: TableName2,
    };
    (0, exports.createFeedbackTable)().then(data => {
        console.log(input.TableName + +" table created!");
        // console.log(data.TableDescription.TableStatus);
        if (data.TableDescription.TableStatus != "ACTIVE") {
            const command = new client_dynamodb_1.DescribeTableCommand(input);
            const handle = setInterval(async () => {
                console.log('check TableStatus');
                const esponse = await ddb.send(command).then(data => {
                    console.log(data.Table.TableStatus);
                    //"TableStatus"
                    if (data.Table.TableStatus == "ACTIVE") {
                        clearInterval(handle); // stops intervals                                                
                    }
                });
            }, 2000);
        }
    });
};
exports.MakeFeedbackTable = MakeFeedbackTable;
const insertUsersFile = () => {
    // console.log('step riempimento tabella');
    console.log('insertUsersFile...');
    const filePath = path.join(__dirname, "/data/users.csv");
    let f = fs.readFileSync(filePath, { encoding: 'utf-8' });
    // Split on row
    let fa = f.split("\r\n");
    // Get first row for column headers
    let headers = fa.shift().split(",");
    fa.forEach(async function (d) {
        // Loop through each row
        let tmp = {};
        let row = d.split(",");
        if (row[0] == "") {
            return;
        }
        for (var i = 0; i < headers.length; i++) {
            tmp[headers[i]] = row[i];
        }
        var params = {
            TableName: "users",
            Item: {
                userId: { N: tmp.userid },
                department: { S: tmp.Department },
                email: { S: tmp.Email },
                firstName: { S: tmp.FirstName },
                lastName: { S: tmp.LastName },
                location: { S: tmp.Location },
                personalid: { S: tmp.personalid },
            },
        };
        //insertUserItem
        const command = new client_dynamodb_1.PutItemCommand(params);
        const response = await ddb.send(command).then(data => {
            console.log("Item Inserted!");
        });
    });
};
exports.insertUsersFile = insertUsersFile;
const insertProductsFile = () => {
    // console.log('step riempimento tabella');
    console.log('insertProductsFile...');
    const filePath = path.join(__dirname, "/data/Products.csv");
    let f = fs.readFileSync(filePath, { encoding: 'utf-8' });
    // Split on row
    let fa = f.split("\r\n");
    // Get first row for column headers
    let headers = fa.shift().split(",");
    fa.forEach(async function (d) {
        // Loop through each row
        let tmp = {};
        let row = d.split(",");
        if (row[0] == "") {
            return;
        }
        for (var i = 0; i < headers.length; i++) {
            tmp[headers[i]] = row[i];
        }
        var params = {
            TableName: TableName,
            Item: {
                ProductId: { N: tmp["﻿ProductId"] },
                ProductName: { S: tmp.ProductName },
            },
        };
        //insertUserItem
        const command = new client_dynamodb_1.PutItemCommand(params);
        const response = await ddb.send(command).then(data => {
            console.log("Item Inserted!");
        });
    });
};
exports.insertProductsFile = insertProductsFile;
//#endregion
//#region fx S3
const listS3 = async () => {
    console.log("listS3...");
    const input = {};
    const command = new client_s3_1.ListBucketsCommand(input);
    return await s3.send(command);
};
exports.listS3 = listS3;
const deleteS3 = async () => {
    console.log("deleteS3...");
    const input = {
        "Bucket": BucketName
    };
    const command = new client_s3_1.DeleteBucketCommand(input);
    return await s3.send(command);
};
exports.deleteS3 = deleteS3;
const createS3 = async () => {
    console.log("createS3...");
    const input = {
        "Bucket": BucketName
    };
    const command = new client_s3_1.CreateBucketCommand(input);
    return await s3.send(command);
};
exports.createS3 = createS3;
const allowPublic = async () => {
    console.log("allowPublic...");
    const input = {
        Bucket: BucketName
    };
    const command = new client_s3_1.DeletePublicAccessBlockCommand(input);
    return await s3.send(command);
};
exports.allowPublic = allowPublic;
const enableWebSite = async () => {
    console.log("enableWebSite...");
    const input = {
        "Bucket": BucketName,
        'WebsiteConfiguration': {
            IndexDocument: {
                "Suffix": "index.html"
            },
        }
    };
    const command = new client_s3_1.PutBucketWebsiteCommand(input);
    return await s3.send(command);
};
exports.enableWebSite = enableWebSite;
const assignS3Policy = async () => {
    console.log("assignS3Policy...");
    const input = {
        "Bucket": BucketName,
        "Policy": JSON.stringify({
            "Id": "Policy1693310659772",
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "Stmt1693310658340",
                    "Action": [
                        "s3:GetObject",
                        "s3:PutObject"
                    ],
                    "Effect": "Allow",
                    "Resource": "arn:aws:s3:::" + BucketName + "/*",
                    "Principal": "*"
                }
            ]
        })
    };
    const command = new client_s3_1.PutBucketPolicyCommand(input);
    return await s3.send(command);
};
exports.assignS3Policy = assignS3Policy;
function creaS3() {
    (0, exports.createS3)().then(data => {
        console.log(data.Location);
        (0, exports.allowPublic)().then(data => {
            // console.log(data);
            (0, exports.enableWebSite)().then(data => {
                // console.log(data);
                (0, exports.assignS3Policy)().then(data => {
                    // console.log(data);
                });
            });
        });
    });
}
//#endregion
//#region fx Lambda
// export const createLambda = async () => {
//     const input = { // CreateFunctionRequest
//         FunctionName: LambdaName,
//         Runtime: "nodejs16.x" ,
//         Role: RoleName,
//         Handler: "STRING_VALUE",
//         Code: { // FunctionCode
//           ZipFile: "BLOB_VALUE",
//           S3Bucket: "STRING_VALUE",
//           S3Key: "STRING_VALUE",
//           S3ObjectVersion: "STRING_VALUE",
//           ImageUri: "STRING_VALUE",
//         },
//         Description: "gr get users fx",
//         CodeSigningConfigArn: "STRING_VALUE",
//         Architectures: [ // ArchitecturesList
//           "arm64",
//         ],
//         EphemeralStorage: { // EphemeralStorage
//           Size: Number("int"), // required
//         },
//         SnapStart: { // SnapStart
//           ApplyOn: "PublishedVersions" || "None",
//         },
//       };
//       const command = new CreateFunctionCommand(input);
//       const response = await lmbd.send(command);
// }
//#endregion
function DoSequence(step) {
    switch (step) {
        case '1':
            /**
                 *
                 * OK: createRole(RoleName) + attachRolePolicy(ddbFullPolicy, RoleName)
                 */
            console.log("CreateRole:" + RoleName);
            (0, exports.createRole)(RoleName).then(data => {
                // console.log(data);
                (0, exports.attachRolePolicy)(ddbFullPolicy, RoleName).then(data => {
                    // console.log(data);
                });
            });
            break;
        case '2':
            /**
             * Verifica se S3 e' gia' presente, lo elimina e lo ricrea
             *
             */
            console.log("Create S3 Bucket: " + BucketName);
            (0, exports.listS3)().then(data => {
                // console.log(data);
                if (data.Buckets.length > 0) {
                    data.Buckets.forEach(b => {
                        if (b.Name == BucketName) {
                            //delete exist bucket                    
                            (0, exports.deleteS3)().then(data => {
                                // console.log(data);
                                creaS3();
                            });
                        }
                    });
                }
                else {
                    creaS3();
                }
            });
            break;
        case '3':
            /**
             * OK: Creazione e popolamento tabelle
             * gr-products e  gr-feedback
             */
            //Table gr-products
            console.log("Create DynamoDB Table: " + TableName);
            let tablePresent = false;
            (0, exports.ListTables)().then(data => {
                // console.log(data);
                if (data.TableNames.length > 0) {
                    data.TableNames.forEach(el => {
                        //User table present
                        if (el == TableName) {
                            console.log(TableName + " present!");
                            tablePresent = true;
                        }
                    });
                    if (tablePresent)
                        return;
                    console.log(TableName + " table NOT present!");
                    tablePresent = false;
                }
            }).then(async () => {
                console.log("prossimo step!");
                if (tablePresent) {
                    let input = {
                        TableName: TableName,
                    };
                    const command = new client_dynamodb_1.DeleteTableCommand(input);
                    //wait deletion
                    const response = await ddb.send(command).then(data => {
                        // console.log(data.TableDescription.TableStatus);
                        const t = setTimeout(() => {
                            console.log(TableName + " table dropped!");
                            (0, exports.MakeProductTable)();
                        }, 5000);
                    });
                }
                else {
                    (0, exports.MakeProductTable)();
                }
                ;
            });
            //Table gr-feedback
            console.log("Create DynamoDB Table: " + TableName2);
            tablePresent = false;
            (0, exports.ListTables)().then(data => {
                console.log(data);
                if (data.TableNames.length > 0) {
                    data.TableNames.forEach(el => {
                        //User table present
                        if (el == TableName2) {
                            console.log(TableName2 + " present!");
                            tablePresent = true;
                        }
                    });
                    if (tablePresent)
                        return;
                    console.log(TableName2 + " table NOT present!");
                    tablePresent = false;
                }
            }).then(async () => {
                // console.log("prossimo step!");
                if (tablePresent) {
                    let input = {
                        TableName: TableName2,
                    };
                    const command = new client_dynamodb_1.DeleteTableCommand(input);
                    //wait deletion
                    const response = await ddb.send(command).then(data => {
                        // console.log(data.TableDescription.TableStatus);
                        const t = setTimeout(() => {
                            console.log(TableName2 + " table dropped!");
                            (0, exports.MakeFeedbackTable)();
                        }, 5000);
                    });
                }
                else {
                    (0, exports.MakeFeedbackTable)();
                }
                ;
            });
            break;
    }
}
var a = process.argv;
DoSequence(a[2]);
// DoSequence("1");
// DoSequence("2");
// DoSequence("3");
//# sourceMappingURL=prog1.js.map