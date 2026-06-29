import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ["ADMIN", "MANAGEMENT", "SALES", "WORKSHOP", "DEALER", "CUSTOMER"],
});
