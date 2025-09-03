import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { HashService } from "src/common/services/hash.service";
import { UserRepository } from "./repositories/user.repository";
import { AddressService } from "../address/address.service";

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly addressService: AddressService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password, address } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) throw new ConflictException("Email já está em uso");

    const hashedPassword = await this.hashService.hash(password);

    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      address,
    });
    const savedUser = await this.usersRepository.save(user);

    return savedUser;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { userById, userByEmail } =
      await this.usersRepository.findByIdOrEmail(id, updateUserDto.email);

    if (!userById)
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    if (updateUserDto.email && userByEmail && userByEmail.id !== id) {
      throw new ConflictException("Email já está em uso");
    }

    if (updateUserDto.oldPassword && updateUserDto.newPassword) {
      const valid = await this.hashService.compare(
        updateUserDto.oldPassword,
        userById.password
      );
      if (!valid) throw new UnauthorizedException("Senha atual inválida");
      userById.password = await this.hashService.hash(
        updateUserDto.newPassword
      );
    }

    const { oldPassword, newPassword, ...rest } = updateUserDto;
    Object.assign(userById, rest);

    return this.usersRepository.save(userById);
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ["address"],
    });
    if (!user) throw new NotFoundException("Usuário não encontrado");
    return user;
  }

  async inactivateUser(id: string): Promise<void> {
    const result = await this.usersRepository.update(id, { isActive: false });
    if (result.affected === 0)
      throw new NotFoundException("Usuário não encontrado");
  }

  async activateUser(id: string): Promise<void> {
    const result = await this.usersRepository.update(id, { isActive: true });
    if (result.affected === 0)
      throw new NotFoundException("Usuário não encontrado");
  }
}
