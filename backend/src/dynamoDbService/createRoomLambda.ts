import { PutCommand, DynamoDBDocumentClient, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { client } from "./dynamoDbClient";

const docClient = DynamoDBDocumentClient.from(client);

const createRoomLambda = async (event: any) => {
    const { roomId, numberOfPlayers, maxPlayers, gameState, creationTime } = JSON.parse(event.body);
    const params: PutCommandInput = {
        TableName: "rooms",
        Item: {
            roomId: roomId,
            numberOfPlayers: numberOfPlayers,
            maxPlayers: maxPlayers,
            gameState: gameState,
            creationTime: creationTime
        }
    };

    const command = new PutCommand(params);
    const response = await docClient.send(command);
    console.log(response);
    return response;
}

exports.handler = createRoomLambda;