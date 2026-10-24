import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType({ description: 'Data to create a list.' })
export class CreateListInput {
  @Field(() => String, { description: 'List name.' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
