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

You will first need to setup your [AWS credentials](https://github.com/serverless/serverless/blob/master/docs/providers/aws/guide/credentials.md) in order to use the serverless framework.

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
stack: movies-dev
api keys:
  None
endpoints:
  POST - https://5lpvwzfvzi.execute-api.us-east-1.amazonaws.com/dev/movies
  GET - https://5lpvwzfvzi.execute-api.us-east-1.amazonaws.com/dev/movies
  GET - https://5lpvwzfvzi.execute-api.us-east-1.amazonaws.com/dev/movies/{title}
  PUT - https://5lpvwzfvzi.execute-api.us-east-1.amazonaws.com/dev/movies/{title}
  DELETE - https://5lpvwzfvzi.execute-api.us-east-1.amazonaws.com/dev/movies/{title}
  GET - https://5lpvwzfvzi.execute-api.us-east-1.amazonaws.com/dev/movies/schema
functions:
  create: movies-dev-create
  list: movies-dev-list
  get: movies-dev-get
  update: movies-dev-update
  delete: movies-dev-delete
  schema: movies-dev-schema
```

## Usage

Run serverless locally with the following command:
```bash
npm run dev
```

Once serverless-offline is up & running, you can populate DynamoDB with the following command:
```bash
node load-movies.js
```

You can create a user and get a token locally with the following commands:

### Create a User

```bash
curl -X POST -H "Content-Type:application/json" https://localhost:3000/movies/user --data '{ "username": "Joe", "password": "i<3bunnies" }' --cacert auth/cert.pem
```

Example Result:
```bash
User created successfully.%
```

### Get a Token

```bash
curl -X POST -H "Content-Type:application/json" https://localhost:3000/movies/token --data '{ "username": "Joe", "password": "i<3bunnies" }' --cacert auth/cert.pem
```

Example Result:
```bash{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImNyZWF0ZWRBdCI6MTUzMzkyNTMyMjEwMSwicGFzc3dvcmQiOiIkMmIkMTAkS1lFYk40aWRiUEtUN2FrMzhSRy4uZUQuTnRSRGEua1VObXQxMEJaOXhOQWNVNS8zandMNVciLCJpZCI6IjQ2ZTgwZGUwLTljY2EtMTFlOC04Y2JiLWIzYTQ5MDkyMzUwOSIsInVwZGF0ZWRBdCI6MTUzMzkyNTMyMjEwMSwidXNlcm5hbWUiOiJKb2UifSwiaWF0IjoxNTMzOTI1NTEzLCJleHAiOjE1MzQwMTE5MTN9.OTQTWgnKQd2KgS5f00izOkkYlJtbB3t4DsMbgxb7s00"}%
```

You can create, retrieve, update, or delete movies locally with the following commands:

### Create a Movie

```bash
curl -X POST -H "Content-Type:application/json" https://localhost:3000/movies --data '{ "title": "Star Wars: Episode IV - A New Hope", "format": "Streaming", "length": "121 min", "releaseYear": "1977", "rating": "5" }' --cacert auth/cert.pem
```

Example Result:
```bash
{"id":"af34dd50-9bea-11e8-a01a-c334472b9029","createdAt":1533829289891,"updatedAt":1533829289891,"title":"Star Wars: Episode IV - A New Hope","format":"Streaming","length":"121 min","releaseYear":"1977","rating":"5"}%
```

### List all Movies

```bash
curl https://localhost:3000/movies --cacert auth/cert.pem
```

Example output:
```bash
[{"length":"121 min","rating":"5","updatedAt":1533829289891,"releaseYear":"1977","createdAt":1533829289891,"id":"af34dd50-9bea-11e8-a01a-c334472b9029","format":"Streaming","title":"Star Wars: Episode IV - A New Hope"},{"length":"121 min","rating":"5","updatedAt":1533829964000,"releaseYear":"1977","createdAt":1533829964000,"id":"4101e330-9bec-11e8-915e-1bb8dddeccc6","format":"Streaming","title":"Star Wars: Episode IV - A New Hope"}]%
```

### Get a Movie

```bash
# Need to encode the url
curl "$( echo 'https://localhost:3000/movies/Star Wars: Episode IV - A New Hope' | sed 's/ /%20/g' )" --cacert auth/cert.pem
```

Example Result:
```bash
{"createdAt":1533839341492,"format":"Streaming","length":"121 min","rating":"5","id":"166d7560-9c02-11e8-8425-67e3a8988850","title":"Star Wars: Episode IV - A New Hope","releaseYear":"1977","updatedAt":1533839341492}%
```

### Update a Movie

```bash
curl -X PUT "$( echo 'https://localhost:3000/movies/Star Wars: Episode IV - A New Hope' | sed 's/ /%20/g' )" --data '{ "format": "DVD", "length": "125 min", "releaseYear": "2001", "rating": "4" }' --cacert auth/cert.pem
```


Example Result:
```bash
{"createdAt":1533842156671,"format":"DVD","length":"125 min","rating":"4","id":"a467d620-9c08-11e8-8221-55c4a1a87d0f","title":"Star Wars: Episode IV - A New Hope","releaseYear":"2001","updatedAt":1533842317303}%
```

### Delete a Movie

```bash
# Replace the <id> part with a real id from your todos table
curl -X DELETE "$( echo 'https://localhost:3000/movies/Star Wars: Episode IV - A New Hope' | sed 's/ /%20/g' )" --cacert auth/cert.pem
```

Example Result:
```bash
{}%
```

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
