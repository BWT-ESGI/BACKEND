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

  async authenticate(token: string, userEmail?: string) {
    try {
      const loginTicket = await this.oAuthClient.verifyIdToken({
        idToken: token,
      });
      const { email, sub: googleId } = loginTicket.getPayload();
      const user = await this.userRepository.findOneBy({ googleId });
      if (user) {
        const token = await this.authService.generateTokens(user);
        return {
          userId: user.id,
          accessToken: token.accessToken,
          role: user.role
        };
      } else if (userEmail) {
        const user = await this.userRepository.findOne({ where: { email: userEmail } });
      
        if (!user) {
          throw new UnauthorizedException('No user found with the provided email.');
        }
      
        user.googleId = googleId;
        user.registrationLinkId = null;
        await this.userRepository.save(user);
      
        return this.authService.generateTokens(user);
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
