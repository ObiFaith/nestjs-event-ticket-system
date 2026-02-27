import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/modules/user/dto/responses.dto';

export class AuthResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty()
  token: string;
}
