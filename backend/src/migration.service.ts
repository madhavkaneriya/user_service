import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

// @Injectable() is decorator to tell NestJS that this is a provider, can be injected as dependencies 
// @OnModuleInit() to tell NestJS to execute on module initialization

@Injectable()
export class MigrationService implements OnModuleInit {
    // @InjectConnection injects the mongodb connection established by MongooseModule.forRoot()
    // In NestJS dependencies are injected through constructor
    constructor(@InjectConnection() private readonly connection: Connection) {};

    async onModuleInit() {
        // run migration on initialization
        await this.runMigration();
    }

    private async runMigration() {
        console.log('MigrationService: runMigration called');
        // initialize the mongodb database, table if doesn't exist
        const db = this.connection.useDb('user_service');

        const collectionFound = await this.collectionExists(db);
        if (!collectionFound) {
            console.log('MigrationService: Creating users collection');
            await db.createCollection('users');
        } else {
            console.log('MigrationService: users collection already exists');
        }
    }

    private async collectionExists(db: Connection, collectionName: String = 'users'): Promise<Boolean> {
        const collectionList = await db.listCollections();
        return collectionList.some((c) => c.name === collectionName);
    }
}
