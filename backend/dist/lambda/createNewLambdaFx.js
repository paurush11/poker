"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const client_lambda_1 = require("@aws-sdk/client-lambda");
const client = new client_lambda_1.LambdaClient({
    region: "us-east-1",
    credentials: {
        "accessKeyId": (_a = process.env.AWS_ACCESS_KEY_ID) !== null && _a !== void 0 ? _a : "",
        "secretAccessKey": (_b = process.env.AWS_SECRET_ACCESS_KEY) !== null && _b !== void 0 ? _b : ""
    }
});
const createFunction = () => {
};
