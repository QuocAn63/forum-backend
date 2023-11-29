import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class EmailVerificationToken extends BaseEntity {
    @PrimaryColumn()
    userId: string

    @ManyToOne(() => User)
    @JoinColumn({name: "userId"})
    user: User


    @Column({type: "text"})
    token: string

    @Column({type: "timestamp"})
    expiredAt: string
}