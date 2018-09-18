<!--
title: AWS Serverless REST API example in NodeJS
description: This example demonstrates how to setup a RESTful Web Service allowing you to create, list, get, update and delete movies. DynamoDB is used to store the data. 
layout: Doc
-->
[![Build Status](https://travis-ci.com/quidmonkey/movies-node.svg?branch=master)](https://travis-ci.com/quidmonkey/movies-node) ![Functions Coverage](./badge-functions.svg?sanitize=true)

# Serverless REST API

This is a fork of the Serverless [aws-node-rest-api-with-dynamodb](https://github.com/serverless/examples/tree/master/aws-node-rest-api-with-dynamodb) project.

This project is a CRUD Rest & GraphQL APIs for a movies database that uses AWS Lambdas, SSM (Secrets), DynamoDB, and the API Gateway. It is written in Node 8.10, and makes use of async/await. It features full linting and 100% test coverage, both enforced using pre-push hooks. This is done using ESLint, Jest, and Husky. It features HTTPS + JWT for authentication & authorization. A self-signed cert is provided for localhost requests (local development).

## Structure

This service has a separate directory for all the movie operations. For each operation exactly one file exists e.g. `src/delete.js`. In each of these files there is exactly one function which is directly attached to `module.exports`.

The idea behind the `movies` directory is that in case you want to create a service containing multiple resources e.g. users, notes, comments you could do so in the same service. While this is certainly possible you might consider creating a separate service for each resource. It depends on the use-case and your preference.

## Use-cases

- API for a Web Application
- API for a Mobile Application

## Setup

You will first need to setup your [AWS credentials](https://github.com/serverless/serverless/blob/master/docs/providers/aws/guide/credentials.md) in order to use the serverless framework. You will also need Node 8.10.3 installed.

Once both of these are done, you can clone this repo and run the following cmd:

```bash
npm install
```

This will run install all Node & serverless dependencies, and generate an auth/secrets.json file for you to use. You can replace this file at any time with your own secret value.

## Rest API Usage

Run tests using the following command:
```bash
npm run quality
```

Run serverless locally with the following command:
```bash
npm run dev
```

When running serverless locally, the DynamoDB instance will be seeded with the data found in movies-seed.json.

After this you can read the movie data using this cmd:
```bash
node misc/get-movies.js
```

You can load random movie data using this cmd:
```bash
node misc/load-movies.js
```

Both the get-movies.js and load-movies.js both take an optional ```--domain``` arg that lets you specify an origin. By default, this is localhost; but once you deploy your Lambdas, you can specify the API Gateway endpoints:
```bash 
node misc/get-movies.js --domain https://5lpvwzfvzi.execute-api.us-east-1.amazonaws.com/dev
```

Inspect the package.json file for additional npm run scripts.

## GraphQL API Usage

You can read movie using this cmd:
```bash
node misc/get-graphql-movies.js
```

You can load random movie data using this cmd:
```bash
node misc/load-graphql-movies.js
```

## Deploy

In order to deploy the endpoint simply run

```bash
npm run build-prod
```

The expected result should be similar to:

```bash
Service Information
service: movies
stage: prod
region: us-east-1
stack: movies-prod
api keys:
  None
endpoints:
  POST - https://5lpvwzfvzi.execute-api.us-east-1.amazonaws.com/prod/movies
  DELETE - https://5lpvwzfvzi.execute-api.us-east-1.amazonaws.com/prod/movies/{title}
  GET - https://5lpvwzfvzi.execute-api.us-east-1.amazonaws.com/prod/movies/{title}
  GET - https://5lpvwzfvzi.execute-api.us-east-1.amazonaws.com/prod/movies/graphql
  POST - https://5lpvwzfvzi.execute-api.us-east-1.amazonaws.com/prod/movies/graphql
  GET - https://5lpvwzfvzi.execute-api.us-east-1.amazonaws.com/prod/movies
  GET - https://5lpvwzfvzi.execute-api.us-east-1.amazonaws.com/prod/movies/schema
  POST - https://5lpvwzfvzi.execute-api.us-east-1.amazonaws.com/prod/movies/token
  PUT - https://5lpvwzfvzi.execute-api.us-east-1.amazonaws.com/prod/movies/{title}
  POST - https://5lpvwzfvzi.execute-api.us-east-1.amazonaws.com/prod/movies/user
functions:
  authorize: movies-prod-authorize
  create: movies-prod-create
  delete: movies-prod-delete
  get: movies-prod-get
  graphql: movies-prod-graphql
  list: movies-prod-list
  schema: movies-prod-schema
  token: movies-prod-token
  update: movies-prod-update
  user: movies-prod-user

  Serverless: Removing old service artifacts from S3...
```

## Rest API with Curl

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
# Replace the <id> part with a real id from your movies table
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
