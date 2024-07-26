"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const createRoom = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const client = new client_dynamodb_1.DynamoDBClient({
        region: "us-east-1",
        credentials: {
            "accessKeyId": (_a = process.env.AWS_ACCESS_KEY_ID) !== null && _a !== void 0 ? _a : "",
            "secretAccessKey": (_b = process.env.AWS_SECRET_ACCESS_KEY) !== null && _b !== void 0 ? _b : ""
        }
    });
    const params = {
        TableName: "rooms",
        AttributeDefinitions: [
            { AttributeName: "roomId", AttributeType: "S" },
            { AttributeName: "numberOfPlayers", AttributeType: "N" },
            { AttributeName: "maxPlayers", AttributeType: "N" },
            { AttributeName: "gameState", AttributeType: "S" },
            { AttributeName: "creationTime", AttributeType: "S" }
        ],
        KeySchema: [
            { AttributeName: "roomId", KeyType: "HASH" } //Partition key
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    };
    const command = new client_dynamodb_1.CreateTableCommand(params);
    const response = yield client.send(command);
    console.log(response);
    return response;
});
