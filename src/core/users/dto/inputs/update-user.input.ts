import { IsArray, IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { ValidRoles } from 'src/core/auth/enums/valid-roles.enum';

@InputType({
  description: 'Fields to update on a user; omitted fields stay unchanged.',
})
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID, { description: 'Id of the user to update.' })
  @IsUUID()
  id: string;

  @Field(() => [ValidRoles], {
    nullable: true,
    description: 'New set of roles.',
  })
  @IsArray()
  @IsOptional()
  roles?: ValidRoles[];

  @Field(() => Boolean, {
    nullable: true,
    description: 'Activate or deactivate the user.',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
