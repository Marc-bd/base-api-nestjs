import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AddressService } from "./address.service";
import { AddressController } from "./address.controller";
import { AddressRepository } from "./repositories/address.repository";
import { Address } from "./entities/address.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  providers: [AddressService, AddressRepository],
  controllers: [AddressController],
  exports: [AddressService, AddressRepository],
})
export class AddressModule {}
