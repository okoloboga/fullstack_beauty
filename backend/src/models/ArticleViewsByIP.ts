import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Content } from './Content'; // Модель статьи

@Entity()
export class ArticleViewsByIP {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    ipAddress!: string;  // IP-адрес пользователя

    @ManyToOne(() => Content, (content) => content.id)
    content!: Content; // Связь с статьей

    @CreateDateColumn({ type: 'timestamp' })
    viewedAt!: Date;  // Дата первого просмотра
}
