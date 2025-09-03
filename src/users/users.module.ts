import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./entities/user.entity";
import { UserRepository } from "./repositories/user.repository";
import { CommonModule } from "../common/common.module";
import { AddressModule } from "../address/address.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), CommonModule, AddressModule],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
