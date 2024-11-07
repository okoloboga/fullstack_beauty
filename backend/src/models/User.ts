import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username!: string;

    @Column()
    password!: string;

    @Column()
    role!: string; // 'user', 'partner', 'admin'

    // Дополнительные поля профиля (все необязательные)
    @Column({ nullable: true })
    email?: string;

    @Column({ nullable: true })
    name?: string;

    @Column({ nullable: true })
    city?: string;

    @Column({ nullable: true })
    activity?: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ nullable: true })
    instagram?: string;

    @Column({ nullable: true })
    vk?: string;

    @Column({ nullable: true })
    telegram?: string;

    @Column({ nullable: true })
    facebook?: string;

    @Column({ nullable: true })
    about?: string;

    @Column({ nullable: true })
    receiveNewsletter?: boolean;

    @Column({ nullable: true })
    profileImage?: string;

    @Column({ nullable: true })
    portfolioImage?: string;
}
