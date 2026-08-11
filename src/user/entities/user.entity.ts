import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class UserEntity {

    @PrimaryColumn('uuid')
    id: string;

    @Column({
        type: 'text', unique: true
    })
    userName: string;

    @Column({
        type: 'text', unique: false, nullable: true
    })
    avatarUrl?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
