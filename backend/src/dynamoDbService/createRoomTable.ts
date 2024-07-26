require('dotenv').config();
import { CreateTableCommand, CreateTableCommandInput, DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { client } from "./dynamoDbClient";


const createRoom = async () => {
    const params: CreateTableCommandInput = {
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

    const command = new CreateTableCommand(params);
    const response = await client.send(command);
    console.log(response);
    return response;
}


const listTables = async () => {
    console.log(process.env.AWS_ACCESS_KEY_ID)
    console.log(process.env.AWS_SECRET_ACCESS_KEY)
    const command = new ListTablesCommand({});
    const response = await client.send(command);
    console.log(response);
    return response;
};
createRoom();

// listTables()