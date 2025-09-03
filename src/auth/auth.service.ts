import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { User } from "../users/entities/user.entity";
import { UserRepository } from "../users/repositories/user.repository";
import { HashService } from "../common/services/hash.service";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { AuthResponseDto } from "./dto/auth-response.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Valida as credenciais do usuário durante o login
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @returns Usuário se as credenciais forem válidas, null caso contrário
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
      relations: ["address"],
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await this.hashService.compare(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return null;
    }
    user.registerLogin();

    return user;
  }

  /**
   * Realiza o login do usuário e retorna o token JWT
   * @param loginDto - Dados de login (email e senha)
   * @returns Resposta com usuário, token e informações de primeiro login
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException("Email ou senha inválidos");
    }

    await this.userRepository.save(user);

    const payload = {
      email: user.email,
      sub: user.id,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_SECRET") || "your-secret-key",
      expiresIn: this.configService.get<string>("JWT_EXPIRES_IN") || "24h",
    });

    return new AuthResponseDto(user, accessToken);
  }

  /**
   * Valida um token JWT e retorna o payload
   * @param token - Token JWT
   * @returns Payload do token se válido
   */
  validateToken(token: string): any {
    try {
      return this.jwtService.verify(token, {
        secret:
          this.configService.get<string>("JWT_SECRET") || "your-secret-key",
      });
    } catch (error) {
      throw new UnauthorizedException("Token inválido ou expirado");
    }
  }
}
