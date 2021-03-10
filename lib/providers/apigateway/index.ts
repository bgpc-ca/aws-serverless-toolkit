import express, { Express } from "express";
import {
  ApiGatewayEvent,
  HttpHeaders,
  BetterRequest,
  BetterResponse,
  ApiGatewayResponse,
  MultiValueHttpHeaders,
} from "../../types/aws/api-gateway";
import { json } from "body-parser";
import cors from "cors";
import { Http2Server } from "http2";

type methodType = "get" | "post" | "put" | "delete";
type FunctionMapValueType = {
  method: methodType;
  fn: (event: ApiGatewayEvent) => Promise<ApiGatewayResponse>;
};

export type FunctionMapType = {
  [path: string]: FunctionMapValueType;
};

type RExtractRequestJuice = {
  headers: HttpHeaders;
  multiValueHeaders: MultiValueHttpHeaders;
  queryStringParameters: HttpHeaders;
  multiValueQueryStringParameters: MultiValueHttpHeaders;
};

export class ApiGatewayLocalClient {
  app: Express;
  functionMap: FunctionMapType;
  server?: Http2Server;
  constructor(functionMap: FunctionMapType, port = 8099) {
    this.functionMap = functionMap;
    this.app = express();
    this.app.use(cors());
    this.app.use(json());
    for (const path in this.functionMap) {
      this.app[this.functionMap[path].method](path, async (req: BetterRequest, res: BetterResponse) => {
        const event = this.generateEvent(req, path);

        const response = await this.functionMap[path].fn(event);
        if (response) {
          for (const header in response.headers) {
            res.setHeader(header, response.headers[header]);
          }
          if (response.body) res.status(response.statusCode).json(JSON.parse(response.body));
          else res.status(response.statusCode);
        }
      });
    }
    this.server = this.app.listen(port);
  }
  extractRequestJuice(req: BetterRequest): RExtractRequestJuice {
    const headers: HttpHeaders = {};
    const multiValueHeaders: MultiValueHttpHeaders = {};
    const queryStringParameters: HttpHeaders = {};
    const multiValueQueryStringParameters: MultiValueHttpHeaders = {};
    for (const q in req.query) {
      if (req.query[q] instanceof Array) {
        multiValueQueryStringParameters[q] = req.query[q] as string[];
      } else if (typeof req.query[q] === "string") {
        queryStringParameters[q] = req.query[q] as string;
      } else {
        throw "Query is wrong";
      }
    }
    for (const h in req.headers) {
      if (req.headers[h] instanceof Array) {
        multiValueHeaders[h] = req.headers[h] as string[];
      } else if (typeof req.headers[h] === "string") {
        headers[h] = req.headers[h] as string;
      } else {
        throw "Headers is wrong";
      }
    }
    return {
      headers,
      multiValueHeaders,
      queryStringParameters,
      multiValueQueryStringParameters,
    };
  }
  generateEvent(req: BetterRequest, path: string): ApiGatewayEvent {
    let temp = false;
    for (const _ in req.body) {
      temp = true;
      break;
    }
    return {
      resource: "/",
      path,
      body: temp ? JSON.stringify(req.body) : null,
      httpMethod: this.functionMap[path].method,
      isBase64Encoded: false,
      pathParameters: req.params,
      requestContext: null,
      stageVariables: null,
      ...this.extractRequestJuice(req),
    };
  }
}
