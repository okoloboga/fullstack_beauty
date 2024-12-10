import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";
import { LikeDislike } from "./LikeDislike";

@Entity()
export abstract class ContentEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.id)
    user!: User;

    @Column({ default: 0 })
    likes!: number;

    @Column({ default: 0 })
    dislikes!: number;

    @Column({ default: 0 })
    favoritesCount!: number;

    // Новое поле для дополнительных изображений
    @Column("simple-array", { default: [] })
    images!: string[];  // Массив строк для хранения URL-ов картинок

    @Column({ nullable: true })
    coverImage!: string;  // Поле для обложки
}

@Entity()
export class Article extends ContentEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    content!: string;

    @Column({ nullable: true })
    coverImage!: string;

    @ManyToOne(() => User, (user) => user.id)
    author!: User;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ default: 0 })
    views!: number;  // Количество просмотров

    @Column({ default: 0 })
    favoritesCount!: number;  // Сколько раз добавили в избранное

    @Column({ default: 0 })
    likes!: number;  // Количество лайков

    @Column({ default: 0 })
    dislikes!: number;  // Количество дизлайков

    @OneToMany(() => Comment, (comment) => comment.content)
    comments!: Comment[];

    @OneToMany(() => LikeDislike, (likeDislike) => likeDislike.content)
    likeDislikes!: LikeDislike[];
}

@Entity()
export class News extends ContentEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    content!: string;

    @Column({ nullable: true })
    coverImage!: string;

    @ManyToOne(() => User, (user) => user.id)
    author!: User;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ default: 0 })
    views!: number;  // Количество просмотров

    @Column({ default: 0 })
    favoritesCount!: number;  // Сколько раз добавили в избранное

    @Column({ default: 0 })
    likes!: number;  // Количество лайков

    @Column({ default: 0 })
    dislikes!: number;  // Количество дизлайков

    @OneToMany(() => Comment, (comment) => comment.content)
    comments!: Comment[];

    @OneToMany(() => LikeDislike, (likeDislike) => likeDislike.content)
    likeDislikes!: LikeDislike[];
}
