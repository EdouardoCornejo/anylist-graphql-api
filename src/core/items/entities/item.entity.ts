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

@Entity({ name: 'items' })
@ObjectType({ description: 'A catalog item owned by a user.' })
export class Item {
  /**
   * The unique identifier of the item.
   */
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'Unique identifier (UUID).' })
  id: string;

  @Column()
  @Field(() => String, { description: 'Item name.' })
  name: string;

  // @Column()
  // @Field(() => Float)
  // quantity: number;

  @Column({ nullable: true })
  @Field(() => String, {
    nullable: true,
    description: 'Unit the quantity is measured in (e.g. kg, lb, box).',
  })
  quantityUnits?: string; // e.g. 'kg', 'litre', 'each'

  @ManyToOne(() => User, (user) => user.items, { nullable: false, lazy: true })
  @Index('userId-index')
  @Field(() => User, { description: 'User who owns the item.' })
  user: User;

  @OneToMany(() => ListItem, (listItem) => listItem.item, { lazy: true })
  @Field(() => [ListItem], {
    description: 'List entries that reference this item.',
  })
  listItem: ListItem[];
}
