import { LambdaClient } from "@aws-sdk/client-lambda";

const client = new LambdaClient({
    region: "us-east-1",
    credentials: {
        "accessKeyId": process.env.AWS_ACCESS_KEY_ID ?? "",
        "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY ?? ""
    }
});

const createFunction = () => {
    
}