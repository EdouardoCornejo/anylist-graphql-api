import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class SearchArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Case-insensitive filter on the name.',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
