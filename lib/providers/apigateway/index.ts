import express, { Express, NextFunction, Response, Request } from "express";
import { ApiGatewayEvent, HttpHeaders } from "../../types/aws/api-gateway";
import bodyParser from "body-parser";
type FunctionMapValueType = {
  method: string;
  fn: (event: ApiGatewayEvent) => void;
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
          this.app.get(path, (req: Request, res: Response, next: NextFunction) => {
            const event: ApiGatewayEvent = {
              resource: "/",
              path,
              body: null,
              headers: req.headers as HttpHeaders,
              httpMethod: this.functionMap[path].method,
              isBase64Encoded: false,
              multiValueHeaders: null,
              pathParameters: null,
              queryStringParameters: null,
              requestContext: null,
              multiValueQueryStringParameters: null,
              stageVariables: null,
            };
            this.functionMap[path].fn(event);
          });
          break;
        case "POST":
          this.app.post(path, (req: Request, res: Response, next: NextFunction) => {
            const event: ApiGatewayEvent = {
              resource: "/",
              path,
              body: req.body,
              headers: req.headers as HttpHeaders,
              httpMethod: this.functionMap[path].method,
              isBase64Encoded: false,
              multiValueHeaders: null,
              pathParameters: null,
              queryStringParameters: null,
              requestContext: null,
              multiValueQueryStringParameters: null,
              stageVariables: null,
            };
            this.functionMap[path].fn(event);
          });
          break;
        case "PUT":
          this.app.put(path, (req: Request, res: Response, next: NextFunction) => {
            this.functionMap[path].fn();
          });
          break;
        case "DELETE":
          this.app.delete(path, (req: Request, res: Response, next: NextFunction) => {
            this.functionMap[path].fn();
          });
          break;
      }
      this.functionMap[path];
    }
    this.app.listen(port, () => {
      console.log("Listening on port:", port);
    });
  }
}
