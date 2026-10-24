import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Item } from 'src/core/items/entities/item.entity';
import { List } from 'src/core/lists/entities/list.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType({ description: 'An application user.' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'Unique identifier (UUID).' })
  id: string;

  @Column()
  @Field(() => String, { description: 'Full name.' })
  fullName: string;

  @Column({ unique: true })
  @Field(() => String, { description: 'Unique email used to log in.' })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'text',
    array: true,
    default: ['user'],
  })
  @Field(() => [String], {
    description: 'Roles granted to the user (admin, user, super_user).',
  })
  roles: string[];

  @Column({
    type: 'boolean',
    default: true,
  })
  @Field(() => Boolean, {
    description: 'Whether the user can log in; false once blocked.',
  })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.lastUpdateBy, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field(() => User, {
    nullable: true,
    description: 'Last user who modified this user.',
  })
  lastUpdateBy?: User;

  @OneToMany(() => Item, (item) => item.user, { lazy: true })
  // @Field(() => [Item])
  items: Array<Item>;

  @OneToMany(() => List, (list) => list.user)
  lists: Array<List>;
}
