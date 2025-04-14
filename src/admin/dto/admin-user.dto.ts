import { Type } from "class-transformer";
import { IsArray, IsEmail, IsInt, IsOptional, IsPositive, IsString, IsUUID, MaxLength, ValidateNested } from "class-validator";

export class AdminUserDto {
  
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsUUID()
  companyId: string;

  @IsString()
  @MaxLength(50)
  name: string;

  @IsEmail()
  @MaxLength(50)
  email: string;;

  @IsString()
  @MaxLength(100)
  password: string;

  @IsInt()
  @IsOptional()
  @IsPositive()
  status?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UserRoleDto)
  roleList?: UserRoleDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UserPermissionDto)
  permissionList?: UserPermissionDto[];
  
  company?: UserCompanyDto;

  constructor(companyId: string, name: string, email: string, password: string, id?: string, status?: number, roleList?: UserRoleDto[], permissionList?: UserPermissionDto[], company?: UserCompanyDto){
    this.companyId = companyId;
    this.name = name;
    this.email = email;
    this.password = password;
    this.id = id;
    this.status = status;
    this.roleList = roleList;
    this.permissionList = permissionList;
    this.company = company;
  }
}

export class UserRoleDto {
  @IsUUID()
  id: string;
  
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name: string;
  
  constructor(id: string, name?: string){
    this.id = id;
    this.name = name;
  }
}

export class UserPermissionDto {
  @IsUUID()
  id: string;

  @IsString()
  @MaxLength(50)
  code: string
  
  constructor(id: string, code: string){
    this.id = id;
    this.code = code;
  }
}

export class UserCompanyDto {
  name: string;
  images: any[];
  
  constructor(name: string, images: any[]) {
    this.name = name;
    this.images = images;
  }

}