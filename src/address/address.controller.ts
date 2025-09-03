import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { AddressService } from "./address.service";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { Address } from "./entities/address.entity";
import { User } from "src/users/entities/user.entity";

@Controller("addresses")
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createAddressDto: CreateAddressDto,
    user: User
  ): Promise<Address> {
    return this.addressService.create(createAddressDto, user);
  }

  @Get("user/:userId")
  @HttpCode(HttpStatus.OK)
  async findByUserId(@Param("userId") userId: string): Promise<Address> {
    return this.addressService.findByUserId(userId);
  }

  @Put("user/:userId")
  @HttpCode(HttpStatus.OK)
  async update(
    @Param("userId") userId: string,
    @Body() updateAddressDto: UpdateAddressDto
  ): Promise<Address> {
    return this.addressService.update(userId, updateAddressDto);
  }

  @Delete("user/:userId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("userId") userId: string): Promise<void> {
    return this.addressService.delete(userId);
  }

  @Get("nearby")
  @HttpCode(HttpStatus.OK)
  async findNearby(
    @Query("latitude") latitude: number,
    @Query("longitude") longitude: number,
    @Query("radius") radius?: number,
    @Query("entityType") entityType?: string
  ): Promise<Address[]> {
    return this.addressService.findNearbyAddresses(
      latitude,
      longitude,
      radius || 10,
      entityType
    );
  }

  @Get("city/:city")
  @HttpCode(HttpStatus.OK)
  async findByCity(@Param("city") city: string): Promise<Address[]> {
    return this.addressService.findByCity(city);
  }

  @Get("state/:state")
  @HttpCode(HttpStatus.OK)
  async findByState(@Param("state") state: string): Promise<Address[]> {
    return this.addressService.findByState(state);
  }
}
