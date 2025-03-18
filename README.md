# AWS Bedrock AI Lambda Serverless Next.js

This repo builds and deploys a fullstack AWS environment with Next.js on the frontend.

## Technology Stack

- **Frontend:**

  - Next.js (App Router) - https://nextjs.org
  - React - https://react.dev
  - TypeScript - https://www.typescriptlang.org
  - Shadcn UI - https://ui.shadcn.com
  - Radix UI - https://www.radix-ui.com
  - Radix Icons - https://www.radix-ui.com/icons
  - Tailwind CSS - https://tailwindcss.com
  - monorepo using npm workspaces - https://docs.npmjs.com/cli/v11/using-npm/workspaces
  - ...

- **Backend:**

  - AWS Cloud Development Kit (CDK) with Typescript - https://docs.aws.amazon.com/cdk/v2/guide/work-with-cdk-typescript.html
  - AWS Bedrock AI Models - https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html
  - AWS CloudFormation - https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html
  - AWS CloudWatch - https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html
  - AWS Certificate Manager (ACM) - https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html
  - AWS Route 53 - https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html
  - AWS CloudFront CDN -
  - AWS CLI - https://docs.aws.amazon.com/cli/ | https://awscli.amazonaws.com/v2/documentation/api/latest/reference/index.html
  - monorepo using npm workspaces - https://docs.npmjs.com/cli/v11/using-npm/workspaces
  - ...

## First, you will need to boostrap your AWS environment

**How AWS Describes Bootstrapping:**

ref: https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html#bootstrapping-what

> Bootstrapping prepares your AWS environment by provisioning specific AWS resources in your environment that are used by the AWS CDK. These resources are commonly referred to as your bootstrap resources. They include the following:

> Amazon Simple Storage Service (Amazon S3) bucket – Used to store your CDK project files, such as AWS Lambda function code and assets.

> Amazon Elastic Container Registry (Amazon ECR) repository – Used primarily to store Docker images.

> AWS Identity and Access Management (IAM) roles – Configured to grant permissions needed by the AWS CDK to perform deployments. For more information about the IAM roles created during bootstrapping, see IAM roles created during bootstrapping.

## Bootstrap AWS CDK

I prefer AWS CDK over ([AWS Amplify](https://aws.amazon.com/amplify/)). AWS Amplify will allow you to setup your environment quicker by abstacting way some of the underlying AWS Infrastructure and Services. Pick either option you're most comfortable with as getting started is what counts. 😊

In order use AWS CDK in an AWS Region you have to bootstrap your account in that region. This initializes CloudFormation for `us-east-1`. NOTE: If you plan to deploy your application to the Internet via Route 53 to your own website (www.example.com), you will need to deploy your application in the `us-east-1` Region.

Get your AWS account number (copy the `Account` number with no quotes):

```bash
aws sts get-caller-identity --query Account --output text
```

Get your AWS region:

```bash
aws configure get region
```

Bootstrap and provision your CloudFormation ennvironment. You need to only do this once in each region you plan to provsion resources. NOTE: If you plan to deploy your application to the Internet via Route 53 to your own website (www.example.com), you will need to deploy your application in the `us-east-1` Region.

```bash
cdk bootstrap aws://[***aws-acct***]/us-east-1
```

## Initalize an AWS CDK TypeScript environment. Call it `backend`.

You have a wide choice of stacks, though for this repo we're using `TypeScript` on the backend which has become an industry best practice.

**NOTE: This step isn't necessary if you're cloning the repo. I'm including the step sequence below to show you how to build this yourself from the ground up.**

```bash
mkdir backend
cd backend
cdk init app --language typescript
```

### Run `cdk synth` to _synthesis_ the _cloud assembly_

As AWS describes the AWS CDK _stack synthesis_:

> Before you can deploy an AWS Cloud Development Kit (AWS CDK) stack, it must first be synthesized. Stack synthesis is the process of producing an AWS CloudFormation template and deployment artifacts from a CDK stack. The template and artifacts are known as the cloud assembly. The cloud assembly is what gets deployed to provision your resources on AWS. For more information on how deployments work, see How AWS CDK deployments work.

- ref: https://docs.aws.amazon.com/cdk/v2/guide/configure-synth.html
- ref: https://docs.aws.amazon.com/cdk/v2/guide/deploy.html#deploy-how

## Run `cdk deploy` to deploy the instatiated template to provision AWS Resources

- The command will change once we have instantiated the Next.js frontend

NOTE: If you into run error deploying, make sure you are deploying to the correct region.

```bash
aws configure
```

- press return/enter to skip the first two fields and change the `Default region name` to where you've set your default region in the AWS Console upper right corner dropdown.

```bash
AWS Access Key ID [****************]:
AWS Secret Access Key [****************]:
Default region name [us-east-2]: us-east-1
Default output format [json]:
```

- ref: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html
- ref: https://www.pluralsight.com/resources/blog/cloud/configuring-the-aws-command-line-interface
- ref: https://www.pluralsight.com/resources/blog/cloud/aws-s3-cheat-sheet

## Make sure to cleanup as needed 🧹

Although, I am on the AWS Free Tier I am charged minimal amount for Route 53 Hosted Zone usage of 0.54 USD monthly, since my websites are up for 12+ hours. If you don't have your own website (www.example.com) don't follow the steps to provsion this service. There will also be a small charge based on Bedrock model ITC - Inference Time Compute. If you host your website on AWS you may be charged additional fees.

Once you're done with your stack, or if at anytime your CDK environment becomes corrupt, compromised, or unresponsive you can `cdk destroy` your enviroment. It's super easy to `cdk deploy` a new environment and you are also reducing your AWS footprint of ghost resources.

- ref: https://labs.watchtowr.com/8-million-requests-later-we-made-the-solarwinds-supply-chain-attack-look-amateur/
- ref: https://www.schneier.com/blog/archives/2025/02/delivering-malware-through-abandoned-amazon-s3-buckets.html
- ref: https://www.wired.com/story/the-untold-story-of-solarwinds-the-boldest-supply-chain-hack-ever/

### Run `cdk destroy` to destroy all resources attached to this CDK stack

**Let's destroy the recently provisioned CDK stack to show how easy it is to cleanup your AWS resources with AWS CDK. This is one of the primary reasons I prefer building from the template rather than through the AWS Console.**

```bash
cdk destroy
Are you sure you want to delete: BackendStack (y/n)? y
```

```bash
...[truncated]...
[SDK info] CloudFormation.DescribeStacks({"StackName":"BackendStack"}) -> OK
[SDK info] CloudFormation.DescribeStackEvents({"StackName":"BackendStack"}) -> ValidationError: Stack [BackendStack] does not exist
[SDK info] CloudFormation.DescribeStacks({"StackName":"BackendStack"}) -> ValidationError: Stack with id BackendStack does not exist
[SDK info] CloudFormation.DescribeStackEvents({"StackName":"BackendStack"}) -> ValidationError: Stack [BackendStack] does not exist

 ✅  BackendStack: destroyed
```

### Rebuild and redeploy

Run:

```bash
cdk deploy
```

```bash
...[truncated]...
[SDK info] CloudFormation.DescribeStacks({"StackName":"BackendStack"}) -> OK
[SDK info] CloudFormation.DescribeStackEvents({"StackName":"BackendStack"}) -> OK
BackendStack | 0/2 | 7:02:19 PM | REVIEW_IN_PROGRESS   | AWS::CloudFormation::Stack | BackendStack User Initiated
BackendStack | 0/2 | 7:02:26 PM | CREATE_IN_PROGRESS   | AWS::CloudFormation::Stack | BackendStack User Initiated
BackendStack | 0/2 | 7:02:28 PM | CREATE_IN_PROGRESS   | AWS::CDK::Metadata | CDKMetadata/Default (CDKMetadata)
BackendStack | 0/2 | 7:02:29 PM | CREATE_IN_PROGRESS   | AWS::CDK::Metadata | CDKMetadata/Default (CDKMetadata) Resource creation Initiated
BackendStack | 1/2 | 7:02:29 PM | CREATE_COMPLETE      | AWS::CDK::Metadata | CDKMetadata/Default (CDKMetadata)
BackendStack | 2/2 | 7:02:30 PM | CREATE_COMPLETE      | AWS::CloudFormation::Stack | BackendStack
[SDK info] CloudFormation.DescribeStacks({"StackName":"BackendStack"}) -> OK
[SDK info] CloudFormation.DescribeStackEvents({"StackName":"BackendStack"}) -> OK

 ✅  BackendStack

✨  Deployment time: 14.33s
```

You will notice that our `BackendStack` will have a different ARN/Id eventhough our code/template is identical to the previously deployed CDK Stack. Also, no need to run `cdk synth` again.

- ref: Amazon Resource Name (ARN) - https://docs.aws.amazon.com/managedservices/latest/userguide/find-arn.html
- ref: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference-arns.html
