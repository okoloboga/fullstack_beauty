import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    type!: string; // Тип уведомления, например, "comment", "news"

    @Column()
    message!: string;

    @Column({ default: false })
    isRead!: boolean; // Статус прочтения уведомления

    @ManyToOne(() => User, (user) => user.id)
    recipient!: User; // Получатель уведомления
}
