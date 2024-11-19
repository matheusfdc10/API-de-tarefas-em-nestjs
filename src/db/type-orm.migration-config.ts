import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as fs from 'fs';
import { TaskEntity } from './entities/task.entity';
import { UserEntity } from './entities/user.entity';

config();

const configService = new ConfigService();

const dataSourceOption: DataSourceOptions = {
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
  entities: [TaskEntity, UserEntity],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
};

export default new DataSource(dataSourceOption);
