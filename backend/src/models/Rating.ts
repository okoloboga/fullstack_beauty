import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Article } from "./Article";

@Entity()
export class Rating {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    value!: number; // Оценка от 1 до 5

    @ManyToOne(() => User, (user) => user.id)
    user!: User;

    @ManyToOne(() => Article, (article) => article.id)
    article!: Article;
}
