import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetUsersResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: [UserResponseDto] })
  users: UserResponseDto[];
}
