import Axios, { AxiosError } from "axios";

export const makePost = <BusinessRequestBody, BusinessResponsePayload, BusinessPossibleErrorData>(
  url: string,
  defaultHeaders?: Record<string, string>,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
) => (body: BusinessRequestBody, headers?: Record<string, string>) =>
  Axios.post<BusinessResponsePayload | BusinessPossibleErrorData>(url, body, { ...defaultHeaders, ...headers }).catch(
    (e: AxiosError<BusinessPossibleErrorData>) => {
      return e.response?.data ?? { code: "UNEXPECTED_ERROR" };
    },
  );
