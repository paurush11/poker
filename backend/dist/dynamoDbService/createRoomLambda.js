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
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const dynamoDbClient_1 = require("./dynamoDbClient");
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(dynamoDbClient_1.client);
const createRoomLambda = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, numberOfPlayers, maxPlayers, gameState, creationTime } = JSON.parse(event.body);
    const params = {
        TableName: "rooms",
        Item: {
            roomId: roomId,
            numberOfPlayers: numberOfPlayers,
            maxPlayers: maxPlayers,
            gameState: gameState,
            creationTime: creationTime
        }
    };
    const command = new lib_dynamodb_1.PutCommand(params);
    const response = yield docClient.send(command);
    console.log(response);
    return response;
});
exports.handler = createRoomLambda;
