import { IsEmail, IsNotEmpty, IsString, IsUUID, Min, MinLength } from 'class-validator';

export class LoginDto {

  @IsEmail()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}