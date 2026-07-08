import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import type { Schema } from "../../data/resource.js";

const cognitoClient = new CognitoIdentityProviderClient();
const USER_POOL_ID = process.env.USER_POOL_ID!;

export const handler: Schema["createDealerUser"]["functionHandler"] = async (event) => {
  const { email, name, tempPassword } = event.arguments;

  await cognitoClient.send(
    new AdminCreateUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "email_verified", Value: "true" },
        { Name: "name", Value: name },
      ],
      TemporaryPassword: tempPassword,
      MessageAction: "SUPPRESS",
    })
  );

  await cognitoClient.send(
    new AdminAddUserToGroupCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      GroupName: "DEALER",
    })
  );

  return { success: true, message: `Dealer user ${email} created.` };
};
