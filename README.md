# AWS Lambda/DynamoDb Geolocation Search API

```
# serverless.yml

service: geolocation

provider:
  name: aws
  runtime: nodejs8.10
  stage: api
  region: us-east-1
functions:
  prod:
    handler: index.handler
    events:
      - http: ANY /
      - http: 'ANY {proxy+}'
```

`npm install`
`serverless deploy`
