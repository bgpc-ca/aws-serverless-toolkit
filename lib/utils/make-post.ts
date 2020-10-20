import Axios from "axios";

export const makePost = <BusinessBodyType, BusinessReturnType>(
  url: string,
  defaultHeaders?: Record<string, string>,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
) => (body: BusinessBodyType, headers?: Record<string, string>) =>
  Axios.post<BusinessReturnType>(url, body, { ...defaultHeaders, ...headers });
