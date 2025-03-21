import * as path from "path";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as acm from "aws-cdk-lib/aws-certificatemanager";

import { getAppEnvConfig } from "../helpers";

export class BedrockAIStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // get environment vars
    const config = getAppEnvConfig();
    console.log(config);

    /**
     * ACM - AWS Certificate Manager
     * Route 53 - AWS DNS Service
     *
     * Automatically provision SSL/TLS Certificates for the specified Rout53 Zone
     */

    // fetch Route 53 Hosted Zone
    // NOTE: AWS charges for this if your site is up more than 12+ hours
    const route53Zone = route53.HostedZone.fromLookup(this, "zone", {
      domainName: config.apexDomain,
    });

    // this will create a SSL/TLS certificate
    const acmSSLCertificate = new acm.Certificate(this, "certficate", {
      domainName: config.apexDomain,
      subjectAlternativeNames: [config.fullUrl],
      validation: acm.CertificateValidation.fromDns(route53Zone),
    });

    // viewer certificate
    const viewerCertificate = cloudfront.ViewerCertificate.fromAcmCertificate(
      acmSSLCertificate,
      {
        aliases: [config.fullUrl],
      }
    );

    // s3 bucket where construct will reside
    const bucket = new s3.Bucket(this, "WebsiteS3Bucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "404.html",
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // CloudFront construct
    const distro = new cloudfront.CloudFrontWebDistribution(
      this,
      "WebsiteCloudFrontDist",
      {
        viewerCertificate: viewerCertificate,
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
              },
            ],
          },
        ],
      }
    );

    // s3 construct to deploy the website dist content
    new s3deploy.BucketDeployment(this, "WebsiteS3BucketDeploy", {
      destinationBucket: bucket,
      sources: [s3deploy.Source.asset("../frontend/dist")],
      distribution: distro,
      distributionPaths: ["/*"],
    });

    // CloudFormation Output construct (i.e., console log for CloudFormation CDK)
    new cdk.CfnOutput(this, "webUrl", {
      exportName: "webUrl",
      value: `https://${distro.distributionDomainName}`,
    });
  }
}
