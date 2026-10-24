import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateItemInput } from './create-item.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType({
  description: 'Fields to update on an item; omitted fields stay unchanged.',
})
export class UpdateItemInput extends PartialType(CreateItemInput) {
  @Field(() => ID, { description: 'Id of the item to update.' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
