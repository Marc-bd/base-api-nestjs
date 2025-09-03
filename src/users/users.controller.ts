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
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Public } from "src/auth/decorators/public.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { AuthenticatedUser } from "../auth/interfaces/authenticated-user.interface";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Public()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.updateUser(user.userId, updateUserDto);
  }

  @Patch("/activate")
  @HttpCode(HttpStatus.NO_CONTENT)
  async activateUser(@CurrentUser() user: AuthenticatedUser): Promise<void> {
    return this.usersService.activateUser(user.userId);
  }

  @Patch("/inactivate")
  @HttpCode(HttpStatus.NO_CONTENT)
  async inactivateUser(@CurrentUser() user: AuthenticatedUser): Promise<void> {
    return this.usersService.inactivateUser(user.userId);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param("id") id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }
}
