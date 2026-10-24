import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType({ description: 'Data to create an item.' })
export class CreateItemInput {
  @Field(() => String, { description: 'Item name.' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => String, {
    nullable: true,
    description: 'Unit the quantity is measured in (e.g. kg, lb, box).',
  })
  @IsOptional()
  @IsString()
  quantityUnits?: string;
}
