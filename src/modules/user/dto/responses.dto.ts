import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class GetUsersResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: [UserResponseDto] })
  users: UserResponseDto[];
}
