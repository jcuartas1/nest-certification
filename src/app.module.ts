import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from '@hapi/joi';


@Module({
  imports: [
    ConfigModule.forRoot(
      {
        validationSchema: Joi.object({
          DB_HOST: Joi.required(),
          DB_PORT: Joi.number().default(5432),
        })
      }
    ), 
    CoffeesModule,
    TypeOrmModule.forRoot({
      type:'postgres',
      host:process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
