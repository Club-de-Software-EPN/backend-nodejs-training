import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import Auth from './Auth.entity';
import Reservation from './Reservation.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'varchar' })
  organization: string;

  @OneToOne(() => Auth, (auth) => auth.user, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  auth: Auth;

  @OneToMany(() => Reservation, (reservation) => reservation.user, { cascade: true })
  reservations: Reservation[];
}

export default User;
