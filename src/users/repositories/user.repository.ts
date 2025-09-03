import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findByIdOrEmail(
    id: string,
    email?: string,
  ): Promise<{
    userById: User | null;
    userByEmail: User | null;
  }> {
    const users = await this.createQueryBuilder("user")
      .where("user.id = :id", { id })
      .orWhere("user.email = :email", { email })
      .getMany();

    const userById = users.find((user) => user.id === id) || null;
    const userByEmail = users.find((user) => user.email === email) || null;

    return {
      userById,
      userByEmail,
    };
  }
}
