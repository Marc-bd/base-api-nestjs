import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("DB_HOST", "localhost"),
        port: configService.get<number>("DB_PORT", 5432),
        username: configService.get<string>("DB_USERNAME", "postgres"),
        password: configService.get<string>("DB_PASSWORD", "12345"),
        database: configService.get<string>("DB_DATABASE", "custom_api"),
        entities: [__dirname + "/../**/*.entity{.ts,.js}"],
        synchronize: configService.get<string>("NODE_ENV") !== "production",
        logging: configService.get<string>("NODE_ENV") !== "production",
      }),
    }),
  ],
})
export class DatabaseModule {}
