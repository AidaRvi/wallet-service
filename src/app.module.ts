import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurations from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      name: 'postgres',
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('postgres_host'),
        port: configService.get('postgres_port'),
        username: configService.get('postgres_username'),
        password: configService.get('postgres_password'),
        database: configService.get('postgres_database'),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
