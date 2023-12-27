import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import 'dotenv/config';
import "reflect-metadata";
import { HttpMethods } from "aws-cdk-lib/aws-s3";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

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
      defaultCorsPreflightOptions: {
        allowHeaders: ["*"],
        allowOrigins: ["*"],
        allowMethods: [HttpMethods.DELETE, HttpMethods.GET, HttpMethods.POST, HttpMethods.PUT],
      },
    });
    
    const proxyResource = restApi.root.addResource("{proxy+}");
    proxyResource.addMethod('ANY',new LambdaIntegration(NestJsLambda));
    
    
    // const PostgresDataSource = new DataSource({
    //   type: "postgres",
    //   host: environment.RDS_HOST ?? 'localhost',
    //   port: 5432,
    //   username: environment.RDS_USERNAME,
    //   password: environment.RDS_PASSWORD,
    //   database: environment.RDS_DATABASE_NAME,
    //   entities: [User, Order, Cart, CartItem, Product],
    //   synchronize: true,
    //   logging: true,
    //   ssl: { rejectUnauthorized: false }
    // })
    //
    // PostgresDataSource.initialize()
    //   .then(() => {
    //     console.log("Data Source has been initialized!")
    //   })
    //   .catch((err) => {
    //     console.error("Error during Data Source initialization", err)
    //   })
  }
}
