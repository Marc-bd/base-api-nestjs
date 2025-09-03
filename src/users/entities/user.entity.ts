import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  PrimaryColumn,
  OneToOne,
} from "typeorm";
import { Exclude } from "class-transformer";
import { v7 as uuidv7 } from "uuid";
import { Address } from "../../address/entities/address.entity";

@Entity()
export class User {
  @PrimaryColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: true })
  @Exclude()
  isActive: boolean;

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @Column({ nullable: true })
  @Exclude()
  firstLoginAt: Date;

  @Column({ nullable: true })
  @Exclude()
  lastLoginAt: Date;

  @OneToOne(() => Address, (address) => address.user, {
    cascade: true,
    eager: true,
  })
  address: Address;

  registerLogin(): boolean {
    const isFirstLogin = !this.firstLoginAt;

    const now = new Date();

    if (isFirstLogin) {
      this.firstLoginAt = now;
    }

    this.lastLoginAt = now;
    return isFirstLogin;
  }

  isFirstLogin(): boolean {
    return !this.firstLoginAt;
  }

  @BeforeInsert()
  generateId(): void {
    if (!this.id) {
      this.id = uuidv7();
    }
  }
}
