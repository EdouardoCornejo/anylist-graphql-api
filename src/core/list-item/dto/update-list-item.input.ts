import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

/**
 * Declared field by field instead of PartialType(CreateListItemInput) so it
 * does not inherit the create defaults: omitted fields stay unchanged.
 */
@InputType()
export class UpdateListItemInput {
  @Field(() => Number, { nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity?: number;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  listId?: string;

  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  itemId?: string;

  @Field(() => ID)
  @IsUUID()
  id: string;
}
