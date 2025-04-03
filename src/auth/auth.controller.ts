import { PfxHttpResponseDto } from 'profaxnojs/axios';

import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Logger, Param, Post, UnauthorizedException } from '@nestjs/common';

import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto): Promise<PfxHttpResponseDto> {
    this.logger.log(`>>> login: username=${loginDto.username}`);
    const start = performance.now();

    return this.authService.login(loginDto)
    .then( (response: PfxHttpResponseDto) => {
      const end = performance.now();
      this.logger.log(`<<< login: executed, runtime=${(end - start) / 1000} seconds, response=${JSON.stringify(response)}`);
      return response;
    })
    .catch((error) => {
      if(error instanceof UnauthorizedException)
        return new PfxHttpResponseDto(HttpStatus.UNAUTHORIZED, error.message);

      this.logger.error(error.stack);
      return new PfxHttpResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    })

  }

  @Post('/initToken/:watchword')
  @HttpCode(HttpStatus.OK)
  initToken(@Param('watchword') watchword: string): Promise<PfxHttpResponseDto> {
    this.logger.log(`>>> initToken`);

    return this.authService.initToken(watchword)
    .then( (response: PfxHttpResponseDto) => {
      const end = performance.now();
      this.logger.log(`<<< initToken: executed, response=${JSON.stringify(response)}`);
      return response;
    })
    .catch((error) => {
      if(error instanceof UnauthorizedException)
        return new PfxHttpResponseDto(HttpStatus.UNAUTHORIZED, error.message);

      this.logger.error(error.stack);
      return new PfxHttpResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    })

  }

  // @Query( () => AuthResponseType, { name: 'authRevalidateToken' })
  //   @UseGuards( JwtAuthGuard )
  //   revalidateToken(
  //     @CurrentUser([PermissionsEnum.ADMIN_AUTH_LOGIN]) userDto: AdminUserType
  //   ): Promise<AuthResponseType> {
  
  //     this.logger.log(`>>> revalidateToken: user=${JSON.stringify(userDto)}`);
  //     const start = performance.now();
  
  //     return this.authService.revalidateToken(userDto)
  //     .then( (response: AuthResponseType) => {
  //       const end = performance.now();
  //       this.logger.log(`<<< revalidateToken: executed, runtime=${(end - start) / 1000} seconds, response=${JSON.stringify(response)}`);
  //       return response;
  //     })
  //     .catch((error) => {
  //       this.logger.error(error.stack);
  //       return new AuthResponseType(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  //     })
  
  //   }
  
  //   @Mutation( () => AuthResponseType, { name: 'authResetPassword' })
  //   resetPassword(
  //     @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput
  //   ): Promise<AuthResponseType> {
      
  //     this.logger.log(`>>> resetPassword: email=${resetPasswordInput.email}`);
  //     const start = performance.now();
  
  //     return this.authService.resetPassword(resetPasswordInput)
  //     .then( (response: AuthResponseType) => {
  //       const end = performance.now();
  //       this.logger.log(`<<< resetPassword: executed, runtime=${(end - start) / 1000} seconds, response=${JSON.stringify(response)}`);
  //       return response;
  //     })
  //     .catch( (error) => {
  //       if(error instanceof BadRequestException)
  //         return new AuthResponseType(HttpStatus.BAD_REQUEST, error.message);
  
  //       this.logger.error(error.stack);
  //       return new AuthResponseType(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  //     })
  
  //   }

}
