#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { BedrockAIStack } from "./cdk-stacks";
import { getAppEnvConfig } from "./helpers";

const config = getAppEnvConfig();

const app = new cdk.App();
new BedrockAIStack(app, "BedrockAIStack", {
  /**
   * For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html
   */
  env: {
    account: config.awsAccountId,
    region: config.awsRegion,
  },
});
