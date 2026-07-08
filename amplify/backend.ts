import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";
import { createDealerUser } from "./functions/create-dealer-user/resource.js";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

const backend = defineBackend({
  auth,
  data,
  createDealerUser,
});

const userPoolId = backend.auth.resources.userPool.userPoolId;

// Pass user pool ID to the Lambda
backend.createDealerUser.addEnvironment("USER_POOL_ID", userPoolId);

// Grant Lambda permission to create users and manage groups
backend.createDealerUser.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: [
      "cognito-idp:AdminCreateUser",
      "cognito-idp:AdminAddUserToGroup",
    ],
    resources: [backend.auth.resources.userPool.userPoolArn],
  })
);
