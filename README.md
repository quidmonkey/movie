<!--
title: AWS Serverless REST API example in NodeJS
description: This example demonstrates how to setup a RESTful Web Service allowing you to create, list, get, update and delete Todos. DynamoDB is used to store the data. 
layout: Doc
-->
# Serverless REST API

This is a fork of the Serverless [aws-node-rest-api-with-dynamodb](https://github.com/serverless/examples/tree/master/aws-node-rest-api-with-dynamodb) project.

This example demonstrates how to setup a [RESTful Web Services](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services) allowing you to create, list, get, update and delete Movies. DynamoDB is used to store the data. This is just an example and of course you could use any data storage as a backend.

## Structure

This service has a separate directory for all the todo operations. For each operation exactly one file exists e.g. `todos/delete.js`. In each of these files there is exactly one function which is directly attached to `module.exports`.

The idea behind the `todos` directory is that in case you want to create a service containing multiple resources e.g. users, notes, comments you could do so in the same service. While this is certainly possible you might consider creating a separate service for each resource. It depends on the use-case and your preference.

## Use-cases

- API for a Web Application
- API for a Mobile Application

## Setup

```bash
npm install
```

## Deploy

In order to deploy the endpoint simply run

```bash
npm run build
```

The expected result should be similar to:

```bash
Serverless: Packaging service…
Serverless: Uploading CloudFormation file to S3…
Serverless: Uploading service .zip file to S3…
Serverless: Updating Stack…
Serverless: Checking Stack update progress…
Serverless: Stack update finished…

Service Information
service: movies
stage: dev
region: us-east-1
api keys:
  None
endpoints:
  POST - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/dev/movies
  GET - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/dev/movies
  GET - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/dev/movies/{title}
  PUT - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/dev/movies/{title}
  DELETE - https://45wf34z5yf.execute-api.us-east-1.amazonaws.com/dev/movies/{title}
functions:
  movies-dev-update: arn:aws:lambda:us-east-1:488110005556:function:movies-dev-update
  movies-dev-get: arn:aws:lambda:us-east-1:488110005556:function:movies-dev-get
  movies-dev-list: arn:aws:lambda:us-east-1:488110005556:function:movies-dev-list
  movies-dev-create: arn:aws:lambda:us-east-1:488110005556:function:movies-dev-create
  movies-dev-delete: arn:aws:lambda:us-east-1:488110005556:function:movies-dev-delete
```

## Usage

Run serverless locally with the following command:
```bash
npm run dev
```

You can create, retrieve, update, or delete movies with the following commands:

### Create a Movie

```bash
curl -X POST -H "Content-Type:application/json" http://localhost:3000/movies --data '{ "title": "Star Wars: Episode IV - A New Hope", "format": "Streaming", "length": "121 min", "releaseYear": "1977", "rating": "5" }'
```

Example Result:
```bash
{"id":"af34dd50-9bea-11e8-a01a-c334472b9029","createdAt":1533829289891,"updatedAt":1533829289891,"title":"Star Wars: Episode IV - A New Hope","format":"Streaming","length":"121 min","releaseYear":"1977","rating":"5"}%
```

### List all Todos

```bash
curl https://XXXXXXX.execute-api.us-east-1.amazonaws.com/dev/todos
```

Example output:
```bash
[{"text":"Deploy my first service","id":"ac90fe80-aa83-11e6-9ede-afdfa051af86","checked":true,"updatedAt":1479139961304},{"text":"Learn Serverless","id":"20679390-aa85-11e6-9ede-afdfa051af86","createdAt":1479139943241,"checked":false,"updatedAt":1479139943241}]%
```

### Get one Todo

```bash
# Replace the <id> part with a real id from your todos table
curl https://XXXXXXX.execute-api.us-east-1.amazonaws.com/dev/todos/<id>
```

Example Result:
```bash
{"text":"Learn Serverless","id":"ee6490d0-aa81-11e6-9ede-afdfa051af86","createdAt":1479138570824,"checked":false,"updatedAt":1479138570824}%
```

### Update a Todo

```bash
# Replace the <id> part with a real id from your todos table
curl -X PUT https://XXXXXXX.execute-api.us-east-1.amazonaws.com/dev/todos/<id> --data '{ "text": "Learn Serverless", "checked": true }'
```

Example Result:
```bash
{"text":"Learn Serverless","id":"ee6490d0-aa81-11e6-9ede-afdfa051af86","createdAt":1479138570824,"checked":true,"updatedAt":1479138570824}%
```

### Delete a Todo

```bash
# Replace the <id> part with a real id from your todos table
curl -X DELETE https://XXXXXXX.execute-api.us-east-1.amazonaws.com/dev/todos/<id>
```

No output

## Scaling

### AWS Lambda

By default, AWS Lambda limits the total concurrent executions across all functions within a given region to 100. The default limit is a safety limit that protects you from costs due to potential runaway or recursive functions during initial development and testing. To increase this limit above the default, follow the steps in [To request a limit increase for concurrent executions](http://docs.aws.amazon.com/lambda/latest/dg/concurrent-executions.html#increase-concurrent-executions-limit).

### DynamoDB

When you create a table, you specify how much provisioned throughput capacity you want to reserve for reads and writes. DynamoDB will reserve the necessary resources to meet your throughput needs while ensuring consistent, low-latency performance. You can change the provisioned throughput and increasing or decreasing capacity as needed.

This is can be done via settings in the `serverless.yml`.

```yaml
  ProvisionedThroughput:
    ReadCapacityUnits: 1
    WriteCapacityUnits: 1
```

In case you expect a lot of traffic fluctuation we recommend to checkout this guide on how to auto scale DynamoDB [https://aws.amazon.com/blogs/aws/auto-scale-dynamodb-with-dynamic-dynamodb/](https://aws.amazon.com/blogs/aws/auto-scale-dynamodb-with-dynamic-dynamodb/)
