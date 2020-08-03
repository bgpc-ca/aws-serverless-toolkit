import { ApiGatewayResponse, ApiGatewayEvent } from "../types";
import { errorHelper } from "../utils/error-helper";
import { internalError } from "../utils/internal-error";
import Axios, { AxiosError, AxiosResponse } from "axios";

// This thing uses Given 100% of the time
export function apiGatewayLambda(
  main: (event: ApiGatewayEvent) => Promise<ApiGatewayResponse>,
): (event: ApiGatewayEvent) => Promise<ApiGatewayResponse> {
  return async function (event: ApiGatewayEvent) {
    try {
      const result = await main(event);
      // NOTE: internalError here is actually never hit, just removing red squigly
      // Also in the worst case you still get a nicely formatted response
      return result || internalError;
    } catch (e) {
      return errorHelper(e);
    }
  };
}

/**
 * The goal is to makePost<B, P> for every business lambda (publicly accessible)
 * And the return value of this makePost call needs to be accessible as a method on this client
 */

export type BusinessPost<B, P> = (body: B) => Promise<P>;

export function makePost<B, P>(url: string): BusinessPost<B, P> {
  return async function (body: B): Promise<P> {
    const response = await Axios.post<P>(url, body).catch((e: AxiosError<P>) => e.response as AxiosResponse<P>);
    return response.data;
  };
}
