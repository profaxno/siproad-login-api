import { BadRequestException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { JwtService } from '@nestjs/jwt';

import { AdminUserService } from '../admin/admin-user.service';

import { LoginDto } from './dto/login.dto';
import { AdminUserDto } from 'src/admin/dto/admin-user.dto';
import { PfxHttpResponseDto } from 'profaxnojs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);

  private readonly siproadWatchword: string;
  private readonly siproadPrincipalUsername: string;

  constructor(
    private readonly ConfigService: ConfigService,
    private readonly adminUserService: AdminUserService,
    private jwtService: JwtService
  ) 
  {
    this.siproadWatchword = this.ConfigService.get("siproadWatchword");
    this.siproadPrincipalUsername = this.ConfigService.get("siproadPrincipalUsername");
  }

  login(loginDto: LoginDto): Promise<PfxHttpResponseDto> {
    this.logger.log(`login: username=${loginDto.username}`);
    
    const { username, password } = loginDto;

    // * create/update user
    return this.adminUserService.findOneByEmail(username)
    .then( (response: PfxHttpResponseDto) => {

      // * generate response
      if(response.internalCode == HttpStatus.OK){
        
        // * get user
        const userDto: AdminUserDto = response.payload[0];

        // * validate password
        if( !bcrypt.compareSync(password, userDto.password ) ) {
          this.logger.warn(`login: wrong password, username=${username}`);
          throw new UnauthorizedException('invalid credentianls');  
        }
        
        // * generate token
        const token = this.generateJwtToken(userDto);

        const data = {
          user: {
            name: userDto.name
          },
          token
        }

        return new PfxHttpResponseDto(response.internalCode, response.message, 1, data);
      }
      
      this.logger.warn(`login: user not found, response=${response.message}, username=${username}`);
      throw new UnauthorizedException('invalid credentianls');  
    })

  }

  initToken(watchword: string): Promise<PfxHttpResponseDto> {
    
    if(watchword != this.siproadWatchword){
      this.logger.warn(`initToken: invalid watchword, watchword=${watchword}`);
      throw new UnauthorizedException('invalid watchword');
    }
    
    // * create/update user
    return this.adminUserService.findOneByEmail(this.siproadPrincipalUsername)
    .then( (response: PfxHttpResponseDto) => {

      // * generate response
      if(response.internalCode == HttpStatus.OK){
        
        // * get user
        const userDto: AdminUserDto = response.payload[0];
        
        // * generate token
        const token = this.generateJwtToken(userDto);

        const data = {
          user: {
            name: userDto.name
          },
          token
        }

        return new PfxHttpResponseDto(response.internalCode, response.message, 1, data);
      }
      
      this.logger.warn(`initToken: user not found, response=${response.message}`);
      throw new UnauthorizedException('invalid credentianls');
    })

  }

  // revalidateToken(userDto: AdminUserType): Promise<AuthResponseType> {
  //   const token = this.generateJwtToken(userDto);

  //   const data = new AuthDataResponseType(token, userDto);

  //   return Promise.resolve(new AuthResponseType(HttpStatus.OK, 'executed', data));
  // }

  // validateUser(id: string): Promise<AdminUserType>{
    
  //   return this.adminUserService.findById(id)
  //   .then( (response: AdminUserResponseType) => {

  //     if(response.internalCode == HttpStatus.OK){
        
  //       // * get user
  //       const userDto: AdminUserType = response.payload[0];

  //       // * validate status
  //       if(userDto.status == UserStatusEnum.BLOCKED){
  //         this.logger.warn(`validateUser: blocked user, id=${id}`);
  //         throw new UnauthorizedException(`inactive user, talk with an admin`);
  //       }

  //       delete userDto.password;
  //       return userDto;
  //     }

  //     this.logger.error(`validateUser: user not found, response=${response.message}, id=${id}`);
  //     throw new UnauthorizedException('user not authorized');
  //   })

  // }

  // resetPassword(resetPasswordInput: ResetPasswordInput): Promise<AuthResponseType> {
  //   const email = resetPasswordInput.email;
  //   this.logger.log(`resetPassword: email=${email}`);
    
  //   // * create/update user
  //   return this.adminUserService.findOneByEmail(email)
  //   .then( (response: AdminUserResponseType) => {

  //     if(response.internalCode == HttpStatus.OK){

  //       // * get user
  //       const userDto: AdminUserType = response.payload[0];
        
  //       // * update user
  //       userDto.password = resetPasswordInput.password;

  //       return this.adminUserService.update(userDto)
  //       .then( () => new AuthResponseType(response.internalCode, response.message) )
  //     }

  //     this.logger.warn(`resetPassword: user not found, response=${response.message}, email=${email}`);
  //     throw new BadRequestException('user not found')
  //   })

  // }

  private generateJwtToken(userDto: AdminUserDto): string {
    const token: string = this.jwtService.sign({
      companyId: userDto.companyId,
      id: userDto.id
    });

    return token;
  }
}
