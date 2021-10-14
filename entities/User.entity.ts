import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import Auth from './Auth.entity';
import Reservation from './Reservation.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varbit' })
  name: string;

  @Column({ type: 'varbit' })
  lastName: string;

  @Column({ type: 'varbit' })
  phone: string;

  @Column({ type: 'varbit' })
  organization: string;

  @OneToOne(() => Auth, (auth) => auth.user, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  auth: Auth;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];
}

export default User;
