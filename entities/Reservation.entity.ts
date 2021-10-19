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

  @Column({ type: 'boolean', default: false, nullable: true })
  paymentStatus: boolean;

  @Column({ type: 'varchar', default: null, nullable: true })
  paymentImageUrl: string;

  @Column({ type: 'date', default: null, nullable: true })
  paymentDate: Date;

  @ManyToOne(() => User, (user) => user.reservations)
  user: User;

  @ManyToOne(() => Course, (course) => course.reservations)
  course: Course;
}

export default Reservation;
