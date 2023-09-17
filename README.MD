# Architecting a website using the Serverless Technology.

Course-end Project 2

## Description

Use the serverless technology to build up a feedback website.

### Description

In the ‘serverless’ way of doing things, we don’t need to think about servers. Because, the capacity planning, scaling, high availability, and fault tolerance — typically expected of a server — are automatically managed by Cloud provider. In this case, we will consider AWS (cloud provider). AWS offers a plethora of services that follow the serverless model, including but not limited to SNS, SQS, Lambda, and SES. One can use these services just by subscribing to them and without actually contacting the server. This eliminates the need to split your attention to ensure all systems are updated and maintained, allowing you to spend more time on the core operations of your business.

Often, companies take feedback from their customers. A book publishing company, for instance, takes the feedback on the newly published book. A cosmetic company takes feedback, on the newly launched cosmetic product. So, after collecting the customer feedback, companies tend to aggregate them all to comprehend the most common issues with the product, and accordingly tweak the product and the marketing strategy designed for the product.

Until now, taking the feedback required creating an EC2 instance, RDS Database, etc. But, in this use case, we will use the `serverless` technologies to build up a feedback website. The services to be used and their purpose are listed below:

- S3 – For storing the web pages
- DynamoDB – For storing the feedback results
- Cognito – To provide the website access to the backend database
- IAM – To specify what permissions to be given
- AWS Services: S3, Cognito, IAM, DynamoDB

### Expected Deliverables:

- Use Serverless technology to create a feedback form
- Store the results in DynamoDB for further analysis