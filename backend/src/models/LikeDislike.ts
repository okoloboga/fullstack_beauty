import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { User } from "./User";
import { ContentEntity } from "./ContentEntity";

@Entity()
export class LikeDislike {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.id)
    user!: User;

    @ManyToOne(() => ContentEntity, (content) => content.id)
    content!: ContentEntity;  // Связь с любым контентом (статья или новость)

    @Column()
    type!: 'like' | 'dislike';  // Лайк или дизлайк
}
