import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from "@nestjs/typeorm";
import { CoffeesModule } from '../../src/coffees/coffees.module';
import * as request from 'supertest';
import { CreateCoffeeDtoTs } from '../../src/coffees/dto/create-coffee.dto.ts/create-coffee.dto';

describe('[Feature] Coffees - /coffees', () => {

  const coffee = {
    name: 'Shipwerck Roast',
    brand: 'Buddy Brew',
    flavors: ['chocolate', 'vanilla']
  };

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          database: 'CoffeeDbTest',
          autoLoadEntities: true,
          synchronize: true
        })
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    }));

    await app.init();
  });

  it('Create [POST /]', () => {
    return request(app.getHttpServer())
      .post('/coffees')
      .send(coffee as CreateCoffeeDtoTs)
      .expect(HttpStatus.CREATED);
  });

  it.todo('Get all [GET /]');
  it.todo('Get one [GET /:id]');
  it.todo('Update one [PATCH /:id]');
  it.todo('Delete one [DELETE /:id]');
  
  afterAll(async () => {
    await app.close()
  })

});