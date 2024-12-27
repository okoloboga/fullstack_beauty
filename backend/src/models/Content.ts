import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";

@Entity()
export class Content {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ default: 0 })
    likes!: number;

    @Column({ default: 0 })
    dislikes!: number;

    @Column({ default: 0 })
    favoritesCount!: number;

    @Column({ default: 0 })
    comments!: number;  // Количество комментов

    @Column("simple-array", { default: [] })
    contentImages!: string[];  // Массив строк для хранения URL-ов картинок

    @Column({ nullable: true })
    coverImage!: string;  // Поле для обложки

    @Column()
    title!: string;

    @Column()
    content!: string;

    @Column()
    category!: string;

    @ManyToOne(() => User, (user) => user.id)
    author!: User;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ default: 0 })
    views!: number;  // Количество просмотров

    @Column({ default: 'article' })
    type!: string;
}
