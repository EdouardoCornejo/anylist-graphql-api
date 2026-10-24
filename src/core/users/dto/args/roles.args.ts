import { IsArray } from 'class-validator';
import { ValidRoles } from '../../../auth/enums/valid-roles.enum';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class ValidRolesArgs {
  @Field(() => [ValidRoles], {
    nullable: true,
    description: 'Return only users that have any of these roles.',
  })
  @IsArray()
  roles: ValidRoles[] = [];
}
