import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  /**
   * Hashed password only
   * Never accept raw passwords here
   */
  @IsString()
  passwordHash: string;
}
