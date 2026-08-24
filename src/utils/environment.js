export const environment = {
  userEndpoint: import.meta.env.VITE_USER_ENDPOINT,
  servicesEndPoint: import.meta.env.VITE_SERVICES_ENDPOINT,
  mastersEndPoint: import.meta.env.VITE_MASTERS_ENDPOINT,
  websiteEndPoint: import.meta.env.VITE_WEBSITE_ENDPOINT,
  expoAdminEndPoint: import.meta.env.VITE_EXPO_ENDPOINT,
  // Cross-app links ("Book Your Stall"). Defaults keep prod behaviour when
  // no build-arg is supplied; the dev CI overrides them with the dev domains.
  builderAllianceUrl:
    import.meta.env.VITE_BUILDER_ALLIANCE_URL || "https://builderalliance.terraterri.com",
  builderAdminUrl:
    import.meta.env.VITE_BUILDER_ADMIN_URL || "https://builder.admin.terraterri.com"
};
