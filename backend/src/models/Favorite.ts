import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { ContentEntity } from "./ContentEntity";

@Entity()
export class Favorite {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.id)
    user!: User;

    @ManyToOne(() => ContentEntity, (content) => content.id)
    content!: ContentEntity;  // Связь с любым контентом (статья или новость)
}
