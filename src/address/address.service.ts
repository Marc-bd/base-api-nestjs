import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { Address } from "./entities/address.entity";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { AddressRepository } from "./repositories/address.repository";
import { User } from "../users/entities/user.entity";

@Injectable()
export class AddressService {
  constructor(private addressRepository: AddressRepository) {}

  async create(
    createAddressDto: CreateAddressDto,
    user: User,
  ): Promise<Address> {
    const existingAddress = await this.addressRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (existingAddress) {
      throw new ConflictException("Usuário já possui um endereço cadastrado");
    }

    const address = this.addressRepository.create({
      ...createAddressDto,
      user,
    });

    return await this.addressRepository.save(address);
  }

  async findByUserId(userId: string): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { user: { id: userId } },
      relations: ["user"],
    });

    if (!address) {
      throw new NotFoundException("Endereço não encontrado para este usuário");
    }

    return address;
  }

  async update(
    userId: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const address = await this.findByUserId(userId);

    Object.assign(address, updateAddressDto);

    return await this.addressRepository.save(address);
  }

  async delete(userId: string): Promise<void> {
    const result = await this.addressRepository.delete({
      user: { id: userId },
    });

    if (result.affected === 0) {
      throw new NotFoundException("Endereço não encontrado para este usuário");
    }
  }

  async findNearbyAddresses(
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
    entityType?: string,
  ): Promise<Address[]> {
    return this.addressRepository.findNearbyAddresses(
      latitude,
      longitude,
      radiusKm,
      entityType,
    );
  }

  async findByCity(city: string): Promise<Address[]> {
    return this.addressRepository.findByCity(city);
  }

  async findByState(state: string): Promise<Address[]> {
    return this.addressRepository.findByState(state);
  }

  /**
   * Calcula a distância entre dois pontos geográficos usando a fórmula de Haversine
   * @param lat1 - Latitude do primeiro ponto
   * @param lng1 - Longitude do primeiro ponto
   * @param lat2 - Latitude do segundo ponto
   * @param lng2 - Longitude do segundo ponto
   * @returns Distância em quilômetros
   */
  calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const earthRadius = 6371; // Raio da Terra em km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c;
  }
}
