import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import 'dotenv/config';

export class CdkCartStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const environment = {
      RDS_HOST: process.env.RDS_HOST!,
      RDS_PORT: process.env.RDS_PORT!,
      RDS_DATABASE_NAME: process.env.RDS_DATABASE_NAME!,
      RDS_USERNAME: process.env.RDS_USERNAME!,
      RDS_PASSWORD: process.env.RDS_PASSWORD!,
      PRODUCT_AWS_REGION: process.env.PRODUCT_AWS_REGION!
    };
   
    const NestJsLambda = new Function(this, 'NestJsLambda', {
      environment,
      code: Code.fromAsset('../dist', {
        exclude: ['node_modules'],
      }),
      handler: 'main.handler',
      runtime: Runtime.NODEJS_20_X,
    });
    
    const restApi = new RestApi(this, 'LambdaApi', {
      restApiName: 'NestJS REST API'
    });
    
    const proxyResource = restApi.root.addResource('{proxy+}');
    proxyResource.addMethod('ANY',new LambdaIntegration(NestJsLambda));
  }
}
