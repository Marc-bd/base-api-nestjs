import { Repository } from "typeorm";
import { Address } from "../entities/address.entity";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class AddressRepository extends Repository<Address> {
  constructor(private dataSource: DataSource) {
    super(Address, dataSource.createEntityManager());
  }

  /**
   * Busca endereços por proximidade geográfica
   * @param latitude - Latitude do ponto de referência
   * @param longitude - Longitude do ponto de referência
   * @param radiusKm - Raio em quilômetros (padrão: 10km)
   * @param entityType - Tipo de entidade para filtrar (opcional: 'user', 'company', etc.)
   * @returns Array de endereços próximos
   */
  async findNearbyAddresses(
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
    entityType?: string,
  ): Promise<Address[]> {
    // Fórmula de Haversine para calcular distância
    const earthRadius = 6371; // Raio da Terra em km
    const latRad = (latitude * Math.PI) / 180;
    const lngRad = (longitude * Math.PI) / 180;

    const queryBuilder = this.createQueryBuilder("address")
      .leftJoinAndSelect("address.user", "user")
      .where(
        `(${earthRadius} * acos(cos(${latRad}) * cos(radians(address.latitude)) * cos(radians(address.longitude) - ${lngRad}) + sin(${latRad}) * sin(radians(address.latitude)))) <= :radius`,
        { radius: radiusKm },
      )
      .andWhere("address.latitude IS NOT NULL")
      .andWhere("address.longitude IS NOT NULL");

    // Filtra por tipo de entidade se especificado
    if (entityType) {
      if (entityType === "user") {
        queryBuilder.andWhere("user.id IS NOT NULL");
      } else if (entityType === "company") {
        // TODO: Implementar quando criar o módulo Company
        // queryBuilder.leftJoinAndSelect("address.company", "company")
        //   .andWhere("company.id IS NOT NULL");
        queryBuilder.andWhere("1 = 0"); // Retorna vazio até implementar
      }
    }

    return queryBuilder.getMany();
  }

  /**
   * Busca endereços por cidade
   * @param city - Nome da cidade
   * @returns Array de endereços na cidade
   */
  async findByCity(city: string): Promise<Address[]> {
    return this.createQueryBuilder("address")
      .where("LOWER(address.city) = LOWER(:city)", { city })
      .getMany();
  }

  /**
   * Busca endereços por estado
   * @param state - Nome do estado
   * @returns Array de endereços no estado
   */
  async findByState(state: string): Promise<Address[]> {
    return this.createQueryBuilder("address")
      .where("LOWER(address.state) = LOWER(:state)", { state })
      .getMany();
  }
}
