import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { User } from "./User";

@Entity()
export class Favorite {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.id)
    user!: User;

    // Одно поле contentId, которое будет указывать на контент (статья или новость)
    @Column({ nullable: true })
    contentId?: number;  // Здесь хранится id контента
}
