import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['userId', 'contentId'])
export class WishlistEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
    })
    userId: string

    @Column({
        type: 'text'
    })
    contentId: string;

}
