import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

/**
 * Declared field by field instead of PartialType(CreateListItemInput) so it
 * does not inherit the create defaults: omitted fields stay unchanged.
 */
@InputType({
  description:
    'Fields to update on a list entry; omitted fields stay unchanged.',
})
export class UpdateListItemInput {
  @Field(() => Number, { nullable: true, description: 'New quantity.' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity?: number;

  @Field(() => Boolean, {
    nullable: true,
    description: 'New completion state.',
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @Field(() => ID, {
    nullable: true,
    description: 'Move the entry to another list.',
  })
  @IsUUID()
  @IsOptional()
  listId?: string;

  @Field(() => ID, {
    nullable: true,
    description: 'Replace the catalog item of the entry.',
  })
  @IsUUID()
  @IsOptional()
  itemId?: string;

  @Field(() => ID, { description: 'Id of the list entry to update.' })
  @IsUUID()
  id: string;
}
