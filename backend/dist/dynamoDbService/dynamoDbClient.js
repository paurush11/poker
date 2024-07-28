"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const client = new client_dynamodb_1.DynamoDBClient({
    region: "us-east-1",
    credentials: {
        "accessKeyId": (_a = process.env.AWS_ACCESS_KEY_ID) !== null && _a !== void 0 ? _a : "",
        "secretAccessKey": (_b = process.env.AWS_SECRET_ACCESS_KEY) !== null && _b !== void 0 ? _b : ""
    }
});
exports.client = client;
