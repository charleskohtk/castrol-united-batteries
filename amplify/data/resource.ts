import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { createDealerUser } from "../functions/create-dealer-user/resource.js";

const schema = a.schema({
  UserRole: a.enum([
    "CUSTOMER",
    "DEALER",
    "WORKSHOP",
    "SALES",
    "MANAGEMENT",
    "ADMIN",
  ]),

  ProductStatus: a.enum(["ACTIVE", "DISCONTINUED"]),

  WarrantyStatus: a.enum(["ACTIVE", "EXPIRED", "VOIDED"]),

  ClaimStatus: a.enum(["PENDING", "APPROVED", "REJECTED"]),

  Dealer: a
    .model({
      name: a.string().required(),
      email: a.string().required(),
      phone: a.string(),
      region: a.string().required(),
      status: a.ref("ProductStatus").required(),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.guest().to(["read"]),
      allow.groups(["ADMIN"]).to(["create", "read", "update", "delete"]),
      allow.groups(["MANAGEMENT", "SALES", "DEALER", "WORKSHOP"]).to(["read"]),
    ]),

  UserProfile: a
    .model({
      email: a.string().required(),
      name: a.string().required(),
      role: a.ref("UserRole").required(),
      regionAssignment: a.string(),
      workshopOrDealerId: a.string(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.groups(["ADMIN"]).to(["create", "read", "update", "delete"]),
      allow.groups(["MANAGEMENT", "SALES"]).to(["read"]),
    ]),

  BatteryProduct: a
    .model({
      modelNumber: a.string().required(),
      batteryType: a.string().required(),
      capacity: a.string().required(),
      warrantyPeriodMonths: a.integer().required(),
      status: a.ref("ProductStatus").required(),
    })
    .authorization((allow) => [
      allow.groups(["ADMIN"]).to(["create", "read", "update", "delete"]),
      allow.groups(["MANAGEMENT", "SALES", "DEALER", "WORKSHOP", "CUSTOMER"]).to(["read"]),
    ]),

  WarrantyRegistration: a
    .model({
      serialNumber: a.string().required(),
      purchaseDate: a.date().required(),
      expiryDate: a.date().required(),
      customerName: a.string().required(),
      customerEmail: a.string().required(),
      customerPhone: a.string(),
      purchaseFrom: a.string(),
      dealerName: a.string(),
      termsAcceptedAt: a.datetime().required(),
      status: a.ref("WarrantyStatus").required(),
      registeredBy: a.string().required(),
      dealerId: a.string(),
      batteryProductId: a.string(),
    })
    .secondaryIndexes((index) => [
      index("serialNumber"),
      index("registeredBy"),
      index("dealerId"),
    ])
    .authorization((allow) => [
      allow.publicApiKey().to(["create"]),
      allow.guest().to(["create"]),
      allow.owner().to(["create", "read"]),
      allow.groups(["ADMIN"]).to(["create", "read", "update", "delete"]),
      allow.groups(["DEALER"]).to(["create", "read"]),
      allow.groups(["WORKSHOP", "SALES", "MANAGEMENT"]).to(["read"]),
    ]),

  WarrantyClaim: a
    .model({
      warrantyRegistrationId: a.string().required(),
      workshopId: a.string().required(),
      failureDate: a.date().required(),
      claimDate: a.date().required(),
      failureDescription: a.string().required(),
      status: a.ref("ClaimStatus").required(),
      resolutionDetails: a.string(),
      adminNotes: a.string(),
    })
    .secondaryIndexes((index) => [
      index("warrantyRegistrationId"),
      index("workshopId"),
    ])
    .authorization((allow) => [
      allow.groups(["ADMIN"]).to(["create", "read", "update", "delete"]),
      allow.groups(["WORKSHOP"]).to(["create", "read"]),
      allow.groups(["MANAGEMENT", "SALES"]).to(["read"]),
      allow.owner().to(["read"]),
    ]),

  createDealerUser: a
    .mutation()
    .arguments({
      email: a.string().required(),
      name: a.string().required(),
      tempPassword: a.string().required(),
    })
    .returns(a.customType({ success: a.boolean(), message: a.string() }))
    .authorization((allow) => [allow.groups(["ADMIN"])])
    .handler(a.handler.function(createDealerUser)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
