import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import Auth from './Auth.entity';
import Course from './Course.entity';

@Entity()
class Administrator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @OneToOne(() => Auth, (auth) => auth.user, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  auth: Auth;

  @OneToMany(() => Course, (course) => course.administrator)
  courses: Course[];
}

export default Administrator;
