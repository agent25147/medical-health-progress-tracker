import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./user";


export const scalesMap = {
    mood: {
        1: "Very Sad",
        2: "Sad",
        3: "Neutral",
        4: "Happy",
        5: "Very Happy"
    },
    anxietyLevel: {
        1: "Low",
        2: "Moderate",
        3: "High"
    },
    sleepQuality: {
        1: "Poor",
        2: "Average",
        3: "Good"
    },
    socialInteractionsFrequency: {
        1: "None",
        2: "Low",
        3: "Moderate",
        4: "High"
    },
    stressLevel: {
        1: "No Stress",
        2: "Low",
        3: "Moderate",
        4: "High",
        5: "Very High"
    }
};


@Entity('health_logs')
export class HealthLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    date: Date;

    @Column({ nullable: false, type: 'int' })
    mood: number;  

    @Column({ nullable: false, type: 'int' })
    anxietyLevel: number;  

    @Column({ nullable: false, type: 'int' })
    sleepHours: number;

    @Column({ nullable: false, type: 'int' })
    sleepQuality: number;  

    @Column({ nullable: true, type: 'text' })
    sleepDisturbances: string;

    @Column({ nullable: true, type: 'text' })
    physicalActivity: string;

    @Column({ nullable: false, type: 'int' })
    socialInteractionsFrequency: number;  

    @Column({ nullable: false, type: 'int' })
    stressLevel: number;  

    @Column({ nullable: true, type: 'text' })
    anxietyDepressionSymptoms: string;

    @ManyToOne(() => User, user => user.id)
    user: User;
}

