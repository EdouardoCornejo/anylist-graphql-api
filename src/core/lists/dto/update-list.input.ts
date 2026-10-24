import { IsUUID } from 'class-validator';
import { CreateListInput } from './create-list.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType({ description: 'Fields to update on a list.' })
export class UpdateListInput extends PartialType(CreateListInput) {
  @Field(() => String, { description: 'Id of the list to update.' })
  @IsUUID()
  id: string;
}
