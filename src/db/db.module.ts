import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        // host: configService.get<string>('DB_HOST'),
        // port: +configService.get<number>('DB_PORT'),
        // username: configService.get<string>('DB_USERNAME'),
        // password: configService.get<string>('DB_PASSWORD'),
        // database: configService.get<string>('DB_NAME'),
        ssl: {
          // rejectUnauthorized: false,
          rejectUnauthorized: true,
          ca: fs.readFileSync('./ca.pem').toString(),
        },
        entities: [__dirname + '/entities/**'],
        migrations: [__dirname + '/migrations/*.ts'],
        autoLoadEntities: true,
        synchronize: true, // production false
        // dropSchema: true, // apaga banco todo
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DbModule {}
