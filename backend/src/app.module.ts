import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MigrationService } from './migration.service';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';

const {
  DB_USER,
  DB_PASS,
  DB_PORT,
  DB_NAME,
  DB_AUTH_SOURCE
} = process.env;

// const MONGO_URI = `mongodb://admin:password@localhost:27017/user_service?authSource=admin`; // for dev
const MONGO_URI = `mongodb://${DB_USER}:${DB_PASS}@mongodb:${DB_PORT}/${DB_NAME}?authSource=${DB_AUTH_SOURCE}`;

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI),
    ThrottlerModule.forRoot([{ // rate limit of 10 requests per second
      ttl: 1000,
      limit: 10,
    }]),
    UsersModule, // feature module
  ],
  controllers: [AppController],
  providers: [AppService, MigrationService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
}],
})
export class AppModule {}
