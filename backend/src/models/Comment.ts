import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { ContentEntity } from "./ContentEntity";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.id)
    user!: User;

    @ManyToOne(() => ContentEntity, (content) => content.id) // Связь с любой сущностью, которая наследует ContentEntity
    content!: ContentEntity;  // Это может быть и статья, и новость

    @Column()
    contentText!: string;  // Текст комментария

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;
}
