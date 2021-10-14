import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  ManyToOne,
} from 'typeorm';

import User from './User.entity';
import Course from './Course.entity';

@Entity()
class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'date' })
  expirationDate: Date;

  @Column({ type: 'decimal' })
  totalPrice: number;

  @Column({ type: 'boolean' })
  paymenStatus: boolean;

  @Column({ type: 'varchar' })
  paymentImageUrl: string;

  @Column({ type: 'date' })
  paymentDate: Date;

  @ManyToOne(() => User, (user) => user.reservations)
  user: User;

  @ManyToOne(() => Course, (course) => course.reservations)
  course: Course;
}

export default Reservation;
