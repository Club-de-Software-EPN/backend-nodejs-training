import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import Administrator from './Administrator.entity';
import Reservation from './Reservation.entity';

@Entity()
class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'date' })
  endInscriptionDate: Date;

  @Column({ type: 'varchar', array: true })
  themes: string[];

  @Column({ type: 'decimal' })
  price: number;

  @OneToMany(() => Reservation, (reservation) => reservation.course)
  reservations: Reservation[];

  @ManyToOne(() => Administrator, (administrator) => administrator.courses)
  administrator: Administrator
}

export default Course;
