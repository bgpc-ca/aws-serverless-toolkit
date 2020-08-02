import { ApiGatewayResponse } from "../types/aws";
// import Axios, { AxiosError, AxiosResponse } from "axios";
// import {
//   MyLambdaResponseBody,
//   MyLambdaRequestBody,
//   MyLambdaPossibleErrorData,
// } from "../../examples/advanced-ts-lambda/lambda";

export const success = <P>(payload: P): ApiGatewayResponse => ({
  statusCode: 200,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ payload }),
});

// const body: MyLambdaRequestBody = {
//   author: "",
//   content: "",
// };

// async function abc() {
//   const response = await Axios.post<MyLambdaResponseBody>("url", body).catch(
//     (e: AxiosError<MyLambdaResponseBody>) => e.response as AxiosResponse<MyLambdaResponseBody>,
//   );

//   if (response.data.error) {
//     switch (response.data.error.code) {
//       case "PROPERTY_FAILS":
//         console.log(response.data.error.FAILED);
//     }
//   }
// }
