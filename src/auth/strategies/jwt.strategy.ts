// import { ExtractJwt, Strategy } from "passport-jwt";

// import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
// import { PassportStrategy } from "@nestjs/passport";
// import { ConfigService } from '@nestjs/config';
// import { AdminUserType } from "src/admin/dto/types";
// import { JwtPayload } from "../interfaces/jwt-payload.interface";
// import { AuthService } from '../auth.service';

// @Injectable()
// export class JwtStrategy extends PassportStrategy( Strategy ) {

//    private readonly logger = new Logger(JwtStrategy.name);

//   constructor(
//     private readonly configService: ConfigService,
//     private readonly authService: AuthService
//   ){
//     super({
//       secretOrKey: configService.get('jwtSecret'),
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
//     })

//   }

//   validate(payload: JwtPayload): Promise<AdminUserType> {
//     //this.logger.log(`validate: ${payload}`);

//     const { id } = payload;

//     return this.authService.validateUser(id)
//   }
  
// }