import {
  ConflictException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { AuthenticationService } from '../authentication.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oAuthClient: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthenticationService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  onModuleInit() {
    const clientId = this.configService.get('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
    this.oAuthClient = new OAuth2Client(clientId, clientSecret);
  }

  private getRedirectUri() {
    const isLocal = process.env.NODE_ENV === 'development';
    return isLocal
      ? this.configService.get('GOOGLE_REDIRECT_URI_LOCAL')
      : this.configService.get('GOOGLE_REDIRECT_URI_PROD');
  }

  async authenticate(token: string, schoolName?: string) {
    try {
      const loginTicket = await this.oAuthClient.verifyIdToken({
        idToken: token,
      });
      const { email, sub: googleId, name } = loginTicket.getPayload();
      const user = await this.userRepository.findOneBy({ googleId });
      if (user) {
        const token = await this.authService.generateTokens(user);
        return {
          userId: user.id,
          accessToken: token.accessToken,
          role: user.role,
        };
      } else if (schoolName) {
        let user = await this.userRepository.findOne({ where: { email } });
      
        if (!user) {
          const { firstName, lastName } = splitName(name);

          user = this.userRepository.create({
            email,
            firstName,
            lastName,
            googleId,
            schoolName,
            registrationLinkId: null,
          });
        } else {
          user.googleId = googleId;
          user.firstName = name;
          user.registrationLinkId = null;
        }
      
        let newUser= await this.userRepository.save(user);

        const token = await this.authService.generateTokens(newUser);
        return {
          userId: user.id,
          accessToken: token.accessToken,
          role: user.role,
        };
      }
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw new UnauthorizedException();
    }
  }
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) {
    return { firstName: parts[0] || '', lastName: '' };
  }
  const [firstName, ...rest] = parts;
  return { firstName, lastName: rest.join(' ') };
}
