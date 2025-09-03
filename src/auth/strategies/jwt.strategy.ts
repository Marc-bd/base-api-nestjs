// src/auth/strategies/jwt.strategy.ts
import { Strategy, ExtractJwt } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UserRepository } from "../../users/repositories/user.repository";
import { AuthenticatedUser } from "../interfaces/authenticated-user.interface";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository
  ) {
    const jwtSecret =
      configService.get<string>("JWT_SECRET") || "your-secret-key";

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser | null> {
    const user = await this.userRepository.findOne({
      where: {
        id: payload.sub,
        isActive: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
