import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ListItem } from 'src/core/list-item/entities/list-item.entity';
import { User } from 'src/core/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'lists' })
@ObjectType({ description: 'A shopping list owned by a user.' })
export class List {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'Unique identifier (UUID).' })
  id: string;

  @Column()
  @Field(() => String, { description: 'List name.' })
  name: string;

  //Relacion, index ('userId-list-index')
  @ManyToOne(() => User, (user) => user.lists, { nullable: false, lazy: true })
  @Index('userId-list-index')
  @Field(() => User, { description: 'User who owns the list.' })
  user: User;

  //Relacion ListItems
  @OneToMany(() => ListItem, (listItem) => listItem.list, { lazy: true })
  // @Field(() => [ListItem])
  listItem: ListItem[];
}
