import * as dotenv from "dotenv";
import { IAppEnvTypes } from "./IAppEnvTypes";

export const getAppEnvConfig = (): IAppEnvTypes => {
  dotenv.config({ path: "../.env" });
  const { AWS_ACCOUNT_ID, AWS_REGION, APEX_DOMAIN, SUBDOMAIN } = process.env;

  // Check if environment variables exist
  if (!AWS_ACCOUNT_ID) {
    throw new Error("AWS_ACCOUNT_ID is not set.  Cannot deploy app to AWS.");
  }
  if (!AWS_REGION) {
    throw new Error("AWS_REGION is not set.  Cannot deploy app to AWS.");
  }
  if (!APEX_DOMAIN) {
    throw new Error("APEX_DOMAIN is not set.  Cannot deploy app to AWS.");
  }
  if (!SUBDOMAIN) {
    throw new Error("SUBDOMAIN is not set.  Cannot deploy app to AWS.");
  }

  // create a full URL from SUBDOMAIN + APEX_DOMAIN
  return {
    awsAccountId: AWS_ACCOUNT_ID,
    awsRegion: AWS_REGION,
    apexDomain: APEX_DOMAIN,
    subDomain: SUBDOMAIN,
    fullUrl: `${SUBDOMAIN}.${APEX_DOMAIN}`,
  };
};
