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
require('dotenv').config();
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const dynamoDbClient_1 = require("./dynamoDbClient");
const createRoom = () => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: "rooms",
        AttributeDefinitions: [
            { AttributeName: "roomId", AttributeType: "S" },
            { AttributeName: "creationTime", AttributeType: "S" },
            { AttributeName: "gameState", AttributeType: "S" } // Included for indexing
        ],
        KeySchema: [
            { AttributeName: "roomId", KeyType: "HASH" },
            { AttributeName: "creationTime", KeyType: "RANGE" }
        ],
        GlobalSecondaryIndexes: [{
                IndexName: "GameStateIndex",
                KeySchema: [
                    { AttributeName: "gameState", KeyType: "HASH" }
                ],
                Projection: {
                    ProjectionType: "ALL"
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1
                }
            }],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    };
    const command = new client_dynamodb_1.CreateTableCommand(params);
    const response = yield dynamoDbClient_1.client.send(command);
    console.log(response);
    return response;
});
const listTables = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(process.env.AWS_ACCESS_KEY_ID);
    console.log(process.env.AWS_SECRET_ACCESS_KEY);
    const command = new client_dynamodb_1.ListTablesCommand({});
    const response = yield dynamoDbClient_1.client.send(command);
    console.log(response);
    return response;
});
createRoom();
// listTables()
