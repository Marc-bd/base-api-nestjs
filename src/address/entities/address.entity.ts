import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  BeforeInsert,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { v7 as uuidv7 } from "uuid";
import { Exclude } from "class-transformer";

@Entity()
export class Address {
  @PrimaryColumn("uuid")
  @Exclude()
  id: string;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column({ nullable: true })
  complement: string;

  @Column()
  neighborhood: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipCode: string;

  @Column()
  country: string;

  @Column({ type: "decimal", precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: "decimal", precision: 11, scale: 8, nullable: true })
  longitude: number;

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.address)
  @JoinColumn()
  user: User;

  @BeforeInsert()
  generateId(): void {
    if (!this.id) {
      this.id = uuidv7();
    }
  }
}
