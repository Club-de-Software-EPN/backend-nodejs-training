import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
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
  isActiveAccount: boolean;

  @OneToOne(() => User, (user) => user.auth) // return, column
  user: User;

  @OneToOne(() => Administrator, (administrator) => administrator.auth)
  adminstrator: User;
}

export default Auth;
