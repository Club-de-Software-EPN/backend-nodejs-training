import {
  Entity, Column, PrimaryGeneratedColumn, OneToOne,
} from 'typeorm';
import Administrator from './Administrator.entity';
import User from './User.entity';

@Entity()
class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'boolean' })
  isActieAccount: boolean;

  @OneToOne(() => User, (user) => user.auth)
  user: User;

  @OneToOne(() => Administrator, (administrator) => administrator.auth)
  administrator: Administrator;
}

export default Auth;
