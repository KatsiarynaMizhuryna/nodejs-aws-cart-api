import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity("users")
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column( { type: 'varchar'} )
    name: string;
    
    @Column({ nullable: true })
    email: string;
    
    @Column({ nullable: true })
    password: string;
}
