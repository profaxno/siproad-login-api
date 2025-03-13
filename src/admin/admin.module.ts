import { PfxHttpModule } from 'profaxnojs/axios';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AdminUserService } from './admin-user.service';

@Module({
  imports: [ConfigModule, PfxHttpModule],
  providers: [AdminUserService],
  exports: [AdminUserService]
})
export class AdminModule {}
