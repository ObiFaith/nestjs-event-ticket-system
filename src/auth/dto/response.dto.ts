import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/user/dto/responses.dto';

export class AuthResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty()
  access_token: string;
}
