import express, { Express } from "express";
import {
  ApiGatewayEvent,
  HttpHeaders,
  BetterRequest,
  BetterResponse,
  ApiGatewayResponse,
} from "../../types/aws/api-gateway";
import bodyParser from "body-parser";
type FunctionMapValueType = {
  method: string;
  fn: (event: ApiGatewayEvent) => ApiGatewayResponse;
};

type FunctionMapType = {
  [key: string]: FunctionMapValueType;
};

class ApiGatewayLocalClient {
  app: Express;
  functionMap: FunctionMapType;
  constructor(functionMap: FunctionMapType, port: number) {
    this.functionMap = functionMap;
    this.app = express();
    this.app.use(bodyParser.json());
    for (const path in this.functionMap) {
      switch (this.functionMap[path].method) {
        case "GET":
          this.app.get(path, (req: BetterRequest, res: BetterResponse) => {
            const event: ApiGatewayEvent = {
              resource: "/",
              path,
              body: null,
              headers: req.headers as HttpHeaders,
              httpMethod: this.functionMap[path].method,
              isBase64Encoded: false,
              multiValueHeaders: null,
              pathParameters: req.params,
              queryStringParameters: req.query,
              requestContext: null,
              multiValueQueryStringParameters: null,
              stageVariables: null,
            };
            const response = this.functionMap[path].fn(event);
            for (const header in response.headers) {
              res.setHeader(header, response.headers[header]);
            }
            res.status(response.statusCode).json(response.body);
          });
          break;
        case "POST":
          this.app.post(path, (req: BetterRequest, res: BetterResponse) => {
            const event: ApiGatewayEvent = {
              resource: "/",
              path,
              body: JSON.stringify(req.body),
              headers: req.headers as HttpHeaders,
              httpMethod: this.functionMap[path].method,
              isBase64Encoded: false,
              multiValueHeaders: null,
              pathParameters: req.params,
              queryStringParameters: req.query,
              requestContext: null,
              multiValueQueryStringParameters: null,
              stageVariables: null,
            };
            const response = this.functionMap[path].fn(event);
            for (const header in response.headers) {
              res.setHeader(header, response.headers[header]);
            }
            res.status(response.statusCode).json(response.body);
          });
          break;
        case "PUT":
          this.app.put(path, (req: BetterRequest, res: BetterResponse) => {
            const event: ApiGatewayEvent = {
              resource: "/",
              path,
              body: JSON.stringify(req.body),
              headers: req.headers as HttpHeaders,
              httpMethod: this.functionMap[path].method,
              isBase64Encoded: false,
              multiValueHeaders: null,
              pathParameters: req.params,
              queryStringParameters: req.query,
              requestContext: null,
              multiValueQueryStringParameters: null,
              stageVariables: null,
            };
            const response = this.functionMap[path].fn(event);
            for (const header in response.headers) {
              res.setHeader(header, response.headers[header]);
            }
            res.status(response.statusCode).json(response.body);
          });
          break;
        case "DELETE":
          this.app.delete(path, (req: BetterRequest, res: BetterResponse) => {
            const event: ApiGatewayEvent = {
              resource: "/",
              path,
              body: JSON.stringify(req.body),
              headers: req.headers as HttpHeaders,
              httpMethod: this.functionMap[path].method,
              isBase64Encoded: false,
              multiValueHeaders: null,
              pathParameters: req.params,
              queryStringParameters: req.query,
              requestContext: null,
              multiValueQueryStringParameters: null,
              stageVariables: null,
            };
            const response = this.functionMap[path].fn(event);
            for (const header in response.headers) {
              res.setHeader(header, response.headers[header]);
            }
            res.status(response.statusCode).json(response.body);
          });
          break;
      }
    }
    this.app.listen(port, () => {
      console.log("Listening on port:", port);
    });
  }
}
