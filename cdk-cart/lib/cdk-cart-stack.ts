import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import 'dotenv/config';
import "reflect-metadata";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export class CdkCartStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const NestJsLambda = new Function(this, 'NestJsLambda', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'main.handler',
      code: Code.fromAsset('../dist'),
      environment: {
        RDS_HOST: process.env.RDS_HOST!,
        RDS_PORT: process.env.RDS_PORT!,
        RDS_DATABASE_NAME: process.env.RDS_DATABASE_NAME!,
        RDS_USERNAME: process.env.RDS_USERNAME!,
        RDS_PASSWORD: process.env.RDS_PASSWORD!,
        PRODUCT_AWS_REGION: process.env.PRODUCT_AWS_REGION!
      },
      timeout: cdk.Duration.seconds(10),
      initialPolicy: [
        new PolicyStatement({
          actions: ['rds-db:connect', 'rds-db:executeStatement'],
          resources: ['*'],
        }),
      ],
    });
    
    const restApi = new RestApi(this, 'LambdaApi', {
      restApiName: 'NestJS REST API',
      // defaultCorsPreflightOptions: {
      //   allowHeaders: ['*'],
      //   allowOrigins: Cors.ALL_ORIGINS,
      //   allowMethods:Cors.ALL_METHODS
      // },
    });
    
    const proxyResource = restApi.root.addResource('{proxy+}');
    proxyResource.addMethod('ANY', new LambdaIntegration(NestJsLambda));
  }
}
