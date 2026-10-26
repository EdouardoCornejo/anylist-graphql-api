import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

@InputType({ description: 'Data to add an item to a list.' })
export class CreateListItemInput {
  @Field(() => Number, {
    nullable: true,
    description: 'Quantity of the item; defaults to 0.',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity: number = 0;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Whether the item is already picked up; defaults to false.',
  })
  @IsBoolean()
  @IsOptional()
  completed: boolean = false;

  @Field(() => ID, {
    description:
      'Id of the target list; must belong to the authenticated user.',
  })
  @IsUUID()
  listId: string;

  @Field(() => ID, {
    description:
      'Id of the item to add; must belong to the authenticated user.',
  })
  @IsUUID()
  itemId: string;
}
