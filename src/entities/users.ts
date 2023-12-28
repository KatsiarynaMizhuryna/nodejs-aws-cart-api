import {Entity, Column, PrimaryGeneratedColumn, BaseEntity} from 'typeorm';

@Entity("users")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column( {  type: 'varchar', length: 250 } )
    name: string;
    
    @Column({ nullable: true })
    email: string;
    
    @Column({ nullable: true })
    password: string;
}
