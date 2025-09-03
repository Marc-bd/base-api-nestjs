import { User } from "../../users/entities/user.entity";

export class AuthResponseDto {
  user: User;
  accessToken: string;

  constructor(user: User, accessToken: string) {
    this.user = user;
    this.accessToken = accessToken;
  }
}
