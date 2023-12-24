import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Cors, RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import 'dotenv/config';
import {DataSource} from "typeorm";
import "reflect-metadata";
import { User } from '../../src/entities/users';
import { Order } from '../../src/entities/orders';
import { Cart } from '../../src/entities/carts';
import { CartItem } from '../../src/entities/cart_items';

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
    proxyResource.addCorsPreflight({
     allowOrigins: Cors.ALL_ORIGINS,
     allowHeaders: Cors.DEFAULT_HEADERS,
     allowMethods: ['GET', 'PUT', 'OPTIONS'],
   });
    
    const PostgresDataSource = new DataSource({
      type: "postgres",
      host: environment.RDS_HOST,
      port: 5432,
      username: environment.RDS_USERNAME,
      password: environment.RDS_PASSWORD,
      database: environment.RDS_DATABASE_NAME,
      entities: [User, Order, Cart, CartItem ],
      synchronize: true,
      logging: true,
      ssl: { rejectUnauthorized: false }
    })
    
    PostgresDataSource.initialize()
      .then(() => {
        console.log("Data Source has been initialized!")
      })
      .catch((err) => {
        console.error("Error during Data Source initialization", err)
      })
  }
}
