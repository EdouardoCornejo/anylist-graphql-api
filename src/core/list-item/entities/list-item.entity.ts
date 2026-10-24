import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Item } from 'src/core/items/entities/item.entity';
import { List } from 'src/core/lists/entities/list.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('listItems')
@ObjectType({
  description: 'An item placed in a list, with its quantity and status.',
})
export class ListItem {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'Unique identifier (UUID).' })
  id: string;

  @Column({ type: 'numeric' })
  @Field(() => Number, { description: 'Quantity of the item to buy.' })
  quantity: number;

  @Column({ type: 'boolean' })
  @Field(() => Boolean, {
    description: 'Whether the item has already been picked up.',
  })
  completed: boolean;

  //Relaciones
  @ManyToOne(() => List, (list) => list.listItem, { lazy: true })
  @Field(() => List, { description: 'List the entry belongs to.' })
  list: List;

  @ManyToOne(() => Item, (item) => item.listItem, { lazy: true })
  @Field(() => Item, { description: 'Catalog item of the entry.' })
  item: Item;
}
