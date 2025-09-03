import {
  Controller,
  Post,
  Put,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Get,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Patch(":id/activate")
  @HttpCode(HttpStatus.NO_CONTENT)
  async activateUser(@Param("id") id: string): Promise<void> {
    return this.usersService.activateUser(id);
  }

  @Patch(":id/inactivate")
  @HttpCode(HttpStatus.NO_CONTENT)
  async inactivateUser(@Param("id") id: string): Promise<void> {
    return this.usersService.inactivateUser(id);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param("id") id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }
}
