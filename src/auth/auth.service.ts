import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import { AuthResponseDto } from './dto/response.dto';
import { User } from 'src/user/entities/user.entity';
import * as SYS_MSG from 'src/constants/system-messages';
import { UserResponseDto } from 'src/user/dto/responses.dto';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Map User entity to user response DTO
   * @param user User data
   * @returns UserResponseDto
   */
  private mapToUserResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }

  generateToken(id: string) {
    const accessToken = this.jwtService.sign(
      {
        id,
      },
      { secret: this.configService.get<string>('jwt.secret'), expiresIn: '1h' },
    );
    return { access_token: accessToken };
  }

  /**
   * Register new user
   * @param registerDto
   * @returns Promise<AuthResponseDto>
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { password, ...restDto } = registerDto;
    // Check user already exists
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException(SYS_MSG.ACCOUNT_ALREADY_EXISTS);
    }
    // Hash password
    const saltRounds = this.configService.get<number>('saltRounds') ?? 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Create user
    const user = await this.userService.create({
      ...restDto,
      passwordHash: hashedPassword,
    });
    // Generate jwt token
    const token = this.generateToken(user.id);

    return {
      message: SYS_MSG.USER_CREATED_SUCCESSFULLY,
      user: this.mapToUserResponseDto(user),
      ...token,
    };
  }

  /**
   * Log user in
   * @param loginDto
   * @returns Promise<AuthResponseDto>
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // Check user already exists
    const existingUser = await this.userService.findByEmail(loginDto.email);
    if (!existingUser) {
      throw new ConflictException(SYS_MSG.USER_NOT_FOUND);
    }
    // Check user password match
    const isMatch = await bcrypt.compare(
      loginDto.password,
      existingUser.passwordHash,
    );
    if (!isMatch) {
      throw new ConflictException(SYS_MSG.USER_NOT_FOUND);
    }
    // Generate jwt token
    const token = this.generateToken(existingUser.id);

    return {
      message: SYS_MSG.USER_LOGIN_SUCCESSFULLY,
      user: this.mapToUserResponseDto(existingUser),
      ...token,
    };
  }
}
