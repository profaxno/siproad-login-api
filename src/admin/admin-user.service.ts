import { PfxHttpMethodEnum, PfxHttpResponseDto, PfxHttpService } from 'profaxnojs/axios';
import * as bcrypt from 'bcryptjs';

import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AdminUserDto } from './dto/admin-user.dto';
import { AdminEnum } from './enums/admin.enum';

@Injectable()
export class AdminUserService {
  private readonly logger = new Logger(AdminUserService.name);

  private siproadAdminHost: string = null;
  private siproadAdminApiKey: string = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly pfxHttpService: PfxHttpService
  ) { 
    this.siproadAdminHost = this.configService.get('siproadAdminHost');
    this.siproadAdminApiKey = this.configService.get('siproadAdminApiKey');
  }

  update(dto: AdminUserDto): Promise<PfxHttpResponseDto>{
    const start = performance.now();

    // encrypt password
    const newDto = {
      ...dto,
      password: bcrypt.hashSync(dto.password, 10)
    }

    // * generate request values
    const method  = PfxHttpMethodEnum.PATCH;
    const path    = this.siproadAdminHost.concat(AdminEnum.PATH_USERS_UPDATE);
    const headers = { "x-api-key": this.siproadAdminApiKey };
    const body    = newDto;

    // * send request
    return this.pfxHttpService.request<PfxHttpResponseDto>(method, path, headers, body)
    .then(response => {

      if ( !(
        response.internalCode == HttpStatus.OK || 
        response.internalCode == HttpStatus.BAD_REQUEST || 
        response.internalCode == HttpStatus.NOT_FOUND) )
        throw new Error(`update: Error, response=${JSON.stringify(response)}`);

      const end = performance.now();
      this.logger.log(`update: OK, runtime=${(end - start) / 1000} seconds`);
      return response;
    })
    .catch(error => {
      this.logger.error(`update: ${error}`);
      throw error;
    })
  }

  // find(companyId: string, paginationArgs: SearchPaginationArgs, inputArgs: SearchInputArgs): Promise<PfxHttpResponseDto>{
  //   const start = performance.now();
    
  //   const method  = PfxHttpMethodEnum.GET;
  //   const path    = this.siproadAdminHost.concat(AdminEnum.PATH_USERS_SEARCH).concat(`/${companyId}`);
  //   const headers = { "x-api-key": this.siproadAdminApiKey };
  //   const body    = inputArgs;
  //   const params  = paginationArgs;

  //   return this.pfxHttpService.request<PfxHttpResponseDto>(method, path, headers, body, params)
  //   .then(response => {

  //     if ( !(
  //       response.internalCode == HttpStatus.OK || 
  //       response.internalCode == HttpStatus.BAD_REQUEST || 
  //       response.internalCode == HttpStatus.NOT_FOUND) )
  //       throw new Error(`find: Error, response=${JSON.stringify(response)}`);

  //     // // * filter
  //     // if(inputArgs.search)
  //     //   response.payload = response.payload.filter(value => value.name.includes(inputArgs.search))

  //     // if(inputArgs.searchList)
  //     //   response.payload = response.payload.filter(value => inputArgs.searchList.includes(value.name))
      
  //     const end = performance.now();
  //     this.logger.log(`find: OK, runtime=${(end - start) / 1000} seconds`);
  //     return response;
  //   })
  //   .catch(error => {
  //     this.logger.error(`find: ${error}`);
  //     throw error;
  //   })
  // }

  // findById(id: string): Promise<PfxHttpResponseDto>{
  //   const start = performance.now();
    
  //   const method  = PfxHttpMethodEnum.GET;
  //   const path    = this.siproadAdminHost.concat(AdminEnum.PATH_USERS_SEARCH_ID).concat(`/${id}`);
  //   const headers = { "x-api-key": this.siproadAdminApiKey };
    
  //   return this.pfxHttpService.request<PfxHttpResponseDto>(method, path, headers)
  //   .then(response => {

  //     if ( !(
  //       response.internalCode == HttpStatus.OK || 
  //       response.internalCode == HttpStatus.BAD_REQUEST || 
  //       response.internalCode == HttpStatus.NOT_FOUND) )
  //       throw new Error(`findById: Error, response=${JSON.stringify(response)}`);

  //     const end = performance.now();
  //     this.logger.log(`findById: OK, runtime=${(end - start) / 1000} seconds`);
  //     return response;
  //   })
  //   .catch(error => {
  //     this.logger.error(`findById: ${error}`);
  //     throw error;
  //   })
  // }

  // findByValue(companyId: string, value: string): Promise<PfxHttpResponseDto>{
  //   const start = performance.now();
    
  //   const method  = PfxHttpMethodEnum.GET;
  //   const path    = this.siproadAdminHost.concat(AdminEnum.PATH_USERS_SEARCH_VALUE).concat(`/${companyId}`).concat(`/${value}`);
  //   const headers = { "x-api-key": this.siproadAdminApiKey };
    
  //   return this.pfxHttpService.request<PfxHttpResponseDto>(method, path, headers)
  //   .then(response => {

  //     if ( !(
  //       response.internalCode == HttpStatus.OK || 
  //       response.internalCode == HttpStatus.BAD_REQUEST || 
  //       response.internalCode == HttpStatus.NOT_FOUND) )
  //       throw new Error(`findByValue: Error, response=${JSON.stringify(response)}`);

  //     const end = performance.now();
  //     this.logger.log(`findByValue: OK, runtime=${(end - start) / 1000} seconds`);
  //     return response;
  //   })
  //   .catch(error => {
  //     this.logger.error(`findByValue: ${error}`);
  //     throw error;
  //   })
  // }

  findOneByEmail(email: string): Promise<PfxHttpResponseDto>{
    const start = performance.now();
    
    const method  = PfxHttpMethodEnum.GET;
    const path    = this.siproadAdminHost.concat(AdminEnum.PATH_USERS_SEARCH_EMAIL).concat(`/${email}`);
    const headers = { "x-api-key": this.siproadAdminApiKey };
    
    return this.pfxHttpService.request<PfxHttpResponseDto>(method, path, headers)
    .then(response => {

      if ( !(
        response.internalCode == HttpStatus.OK || 
        response.internalCode == HttpStatus.BAD_REQUEST || 
        response.internalCode == HttpStatus.NOT_FOUND) )
        throw new Error(`findOneByEmail: Error, response=${JSON.stringify(response)}`);

      const end = performance.now();
      this.logger.log(`findOneByEmail: OK, runtime=${(end - start) / 1000} seconds, response=${response.qty}`);
      return response;
    })
    .catch(error => {
      this.logger.error(`findOneByEmail: ${error}`);
      throw error;
    })
  }

  block(id: string): Promise<PfxHttpResponseDto>{
    const start = performance.now();

    // * generate request values
    const method  = PfxHttpMethodEnum.DELETE;
    const path    = this.siproadAdminHost.concat(AdminEnum.PATH_USERS_DELETE).concat(`/${id}`);;
    const headers = { "x-api-key": this.siproadAdminApiKey };
    const body    = {};

    // * send request
    return this.pfxHttpService.request<PfxHttpResponseDto>(method, path, headers, body)
    .then(response => {

      if ( !(
        response.internalCode == HttpStatus.OK || 
        response.internalCode == HttpStatus.CREATED || 
        response.internalCode == HttpStatus.BAD_REQUEST || 
        response.internalCode == HttpStatus.NOT_FOUND) )
        throw new Error(`block: Error, response=${JSON.stringify(response)}`);

      const end = performance.now();
      this.logger.log(`block: OK, runtime=${(end - start) / 1000} seconds`);
      return response;
    })
    .catch(error => {
      this.logger.error(`block: ${error}`);
      throw error;
    })
  }
}
