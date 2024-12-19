import { OnModuleInit } from '@nestjs/common';
import { Connection } from 'mongoose';
export declare class MigrationService implements OnModuleInit {
    private readonly connection;
    constructor(connection: Connection);
    onModuleInit(): Promise<void>;
    private runMigration;
    private collectionExists;
}
