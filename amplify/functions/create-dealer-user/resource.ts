import { defineFunction } from "@aws-amplify/backend";

export const createDealerUser = defineFunction({
  name: "create-dealer-user",
  entry: "./handler.ts",
});
