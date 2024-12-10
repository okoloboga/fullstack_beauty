import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Article } from './ContentEntity'; // Модель статьи

@Entity()
export class ArticleViewsByIP {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    ipAddress!: string;  // IP-адрес пользователя

    @ManyToOne(() => Article, (article) => article.id)
    article!: Article; // Связь с статьей

    @CreateDateColumn({ type: 'timestamp' })
    viewedAt!: Date;  // Дата первого просмотра
}
