import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, {
    nullable: true,
    description: 'Number of records to skip.',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  offset: number = 0;

  @Field(() => Int, {
    nullable: true,
    description: 'Maximum number of records to return.',
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit: number = 10;
}
