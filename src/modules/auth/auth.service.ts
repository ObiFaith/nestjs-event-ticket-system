import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserResponseDto } from 'src/modules/user/dto';
import * as SYS_MSG from 'src/constants/system-messages';
import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/modules/user/entities/user.entity';
import { AuthResponseDto, LoginDto, RegisterDto } from './dto';
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
      lastName: user.lastName,
      firstName: user.firstName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  generateToken(id: string) {
    const token = this.jwtService.sign(
      {
        id,
      },
      { secret: this.configService.get<string>('jwt.secret'), expiresIn: '1h' },
    );
    return token;
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
      token,
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
      token,
    };
  }
}
