import {
  Entity, // entity decorator
  Column, // column decorator
  PrimaryGeneratedColumn, // Primary Keys
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import Auth from './Auth.entity';
import Course from './Course.entity';

@Entity() // use entity decorator (modify tsconfig.json)
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
  courses: Course[]
}

export default Administrator;
