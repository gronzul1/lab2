import { CreateTableCommand, DeleteTableCommand, DescribeTableCommand, DynamoDB, ListTablesCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { AttachRolePolicyCommand, CreateRoleCommand, DeleteRoleCommand, IAMClient } from "@aws-sdk/client-iam";
import { S3Client, CreateBucketCommand, PutBucketPolicyCommand, PutBucketWebsiteCommand, ListBucketsCommand, DeleteBucketCommand, DeletePublicAccessBlockCommand, CopyObjectCommand } from "@aws-sdk/client-s3"; // ES Modules import
import { LambdaClient } from "@aws-sdk/client-lambda";
import * as fs from "fs";
import * as path from "path";

const REGION = "us-east-1";

const s3 = new S3Client({ region: REGION });
const ddb = new DynamoDB({ region: REGION });
const iam = new IAMClient({});
const lmbd = new LambdaClient({});

const RoleName: string = "gr-getData-role";
const BucketName: string = "gr-feedback-bucket";
const LambdaName: string = "gr-GetData-lambda";
const ddbFullPolicy: string = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess";
const TableName: string = "gr-products";
const TableName2: string = "gr-feedback";
const apiGateway: string = 'gr-auth-api'

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
export const createRole = async (roleName) => {
    console.log("createRole...")
    const command = new CreateRoleCommand({
        AssumeRolePolicyDocument:
            JSON.stringify({
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

export const deleteRole = async (roleName) => {
    console.log("deleteRole...")
    const command = new DeleteRoleCommand({ RoleName: roleName });
    return await iam.send(command);
};

export const attachRolePolicy = async (policyArn, roleName) => {
    console.log("attachRolePolicy...")
    const command = new AttachRolePolicyCommand({
        PolicyArn: policyArn,
        RoleName: roleName,
    });
    return await iam.send(command);
};
//#endregion

//#region fx DynamoDB
export const ListTables = async () => {
    console.log("ListTables...")
    const input = {};
    const command = new ListTablesCommand(input);
    return await ddb.send(command);
}

export const createProductTable = async () => {
    console.log("createProductTable...")
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
    const command = new CreateTableCommand(input);
    return await ddb.send(command);
}

export const createFeedbackTable = async () => {
    console.log("createFeedbackTable...")
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
    const command = new CreateTableCommand(input);
    return await ddb.send(command);
}

export const MakeProductTable = async () => {
    const input = {
        TableName: TableName,
    };
    createProductTable().then(data => {
        console.log(input.TableName + " table created!")
        // console.log(data.TableDescription.TableStatus);

        if (data.TableDescription.TableStatus != "ACTIVE") {
            const command = new DescribeTableCommand(input);
            const handle = setInterval(async (): Promise<void> => {
                console.log('check TableStatus');
                const esponse = await ddb.send(command).then(data => {
                    console.log(data.Table.TableStatus);
                    //"TableStatus"
                    if (data.Table.TableStatus == "ACTIVE") {
                        clearInterval(handle); // stops intervals                        
                        insertProductsFile();
                    }
                });
            }, 2000);
        }
    });
}

export const MakeFeedbackTable = async () => {
    const input = {
        TableName: TableName2,
    };
    createFeedbackTable().then(data => {
        console.log(input.TableName + + " table created!")
        // console.log(data.TableDescription.TableStatus);

        if (data.TableDescription.TableStatus != "ACTIVE") {
            const command = new DescribeTableCommand(input);
            const handle = setInterval(async (): Promise<void> => {
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
}

export const insertUsersFile = () => {
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
        let tmp: any = {};
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
        const command = new PutItemCommand(params);
        const response = await ddb.send(command).then(data => {
            console.log("Item Inserted!");
        });
    });

}

export const insertProductsFile = () => {
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
        let tmp: any = {};
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
        const command = new PutItemCommand(params);
        const response = await ddb.send(command).then(data => {
            console.log("Item Inserted!");
        });
    });

}

//#endregion

//#region fx S3
export const listS3 = async () => {
    console.log("listS3...")
    const input = {};
    const command = new ListBucketsCommand(input);
    return await s3.send(command);
}

export const deleteS3 = async () => {
    console.log("deleteS3...")
    const input = {
        "Bucket": BucketName
    };
    const command = new DeleteBucketCommand(input);
    return await s3.send(command);

}

export const createS3 = async () => {
    console.log("createS3...")
    const input = {
        "Bucket": BucketName
    };
    const command = new CreateBucketCommand(input);
    return await s3.send(command);
}

export const allowPublic = async () => {
    console.log("allowPublic...")
    const input = { // DeletePublicAccessBlockRequest
        Bucket: BucketName
    };
    const command = new DeletePublicAccessBlockCommand(input);
    return await s3.send(command);
}

export const enableWebSite = async () => {
    console.log("enableWebSite...")
    const input = {
        "Bucket": BucketName,
        'WebsiteConfiguration':
        { // WebsiteConfiguration
            IndexDocument: { // IndexDocument
                "Suffix": "index.html"
            },
        }
    };
    const command = new PutBucketWebsiteCommand(input);
    return await s3.send(command);
}

export const assignS3Policy = async () => {
    console.log("assignS3Policy...")
    const input = {
        "Bucket": BucketName,
        "Policy": JSON.stringify(
            {
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
            }
        )
    };
    const command = new PutBucketPolicyCommand(input);
    return await s3.send(command);
}

function creaS3() {
    createS3().then(data => {
        console.log(data.Location);
        allowPublic().then(data => {
            // console.log(data);
            enableWebSite().then(data => {
                // console.log(data);
                assignS3Policy().then(data => {
                    // console.log(data);
                });
            })
        })
    })
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

//#region fx S3 Copy Site
export const copyWebSite = async () => {
    const input = {
        "Bucket": BucketName,
        "CopySource": "../gr-aws-lab/dist/*",
        "Key":"CopyWeb"
      };
      const command = new CopyObjectCommand(input);
      const response = await s3.send(command);
      console.log(response);
}
//#endregion

function DoSequence(step) {
    switch (step) {
        case '1':
            /**
                 * 
                 * OK: createRole(RoleName) + attachRolePolicy(ddbFullPolicy, RoleName)
                 */
            console.log("CreateRole:" + RoleName) ;
            createRole(RoleName).then(data => {
                // console.log(data);
                attachRolePolicy(ddbFullPolicy, RoleName).then(data => {
                    // console.log(data);
                });
            })
            break;
        case '2':
            /**
             * Verifica se S3 e' gia' presente, lo elimina e lo ricrea
             * 
             */
            console.log("Create S3 Bucket: "+ BucketName);
            listS3().then(data => {
                // console.log(data);
                if (data.Buckets.length > 0) {
                    data.Buckets.forEach(b => {
                        if (b.Name == BucketName) {
                            //delete exist bucket                    
                            deleteS3().then(data => {
                                // console.log(data);
                                creaS3();
                            });
                        }
                    });
                }
                else {
                    creaS3();
                }
            })

            break;
        case '3':
            /**
             * OK: Creazione e popolamento tabelle
             * gr-products e  gr-feedback
             */                        
            
            //Table gr-products
            console.log("Create DynamoDB Table: "+ TableName);
            let tablePresent: boolean = false;
            ListTables().then(data => {
                // console.log(data);
                if (data.TableNames.length > 0) {
                    data.TableNames.forEach(el => {
                        //User table present
                        if (el == TableName) {
                            console.log(TableName + " present!")
                            tablePresent = true;
                        }
                    });
                    if (tablePresent)
                        return;
                    console.log(TableName + " table NOT present!")
                    tablePresent = false;
                }
            }).then(async () => {
                console.log("prossimo step!");
                if (tablePresent) {
                    let input = {
                        TableName: TableName,
                    };
                    const command = new DeleteTableCommand(input);
                    //wait deletion
                    const response = await ddb.send(command).then(data => {
                        // console.log(data.TableDescription.TableStatus);
                        const t = setTimeout(() => {
                            console.log(TableName + " table dropped!")
                            MakeProductTable();
                        }, 5000);
                    });
                }
                else {
                    MakeProductTable();
                };
            }
            );

            //Table gr-feedback
            console.log("Create DynamoDB Table: "+ TableName2);
            tablePresent = false;
            ListTables().then(data => {
                console.log(data);
                if (data.TableNames.length > 0) {
                    data.TableNames.forEach(el => {
                        //User table present
                        if (el == TableName2) {
                            console.log(TableName2 + " present!")
                            tablePresent = true;
                        }
                    });
                    if (tablePresent)
                        return;
                    console.log(TableName2 + " table NOT present!")
                    tablePresent = false;
                }
            }).then(async () => {
                // console.log("prossimo step!");
                if (tablePresent) {
                    let input = {
                        TableName: TableName2,
                    };
                    const command = new DeleteTableCommand(input);
                    //wait deletion
                    const response = await ddb.send(command).then(data => {
                        // console.log(data.TableDescription.TableStatus);
                        const t = setTimeout(() => {
                            console.log(TableName2 + " table dropped!")
                            MakeFeedbackTable();
                        }, 5000);
                    });
                }
                else {
                    MakeFeedbackTable();
                };
            }
            );
            break;
    }
}

var a = process.argv;
// DoSequence(a[2]);

copyWebSite();


