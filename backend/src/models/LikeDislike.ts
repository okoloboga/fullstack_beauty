import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class LikeDislike {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.id)
    user!: User;

    // Одно поле contentId, которое будет указывать на контент (статья или новость)
    @Column({ nullable: true })
    contentId?: number;  // Здесь хранится id контента

    @Column()
    type!: 'like' | 'dislike';  // Лайк или дизлайк
}
