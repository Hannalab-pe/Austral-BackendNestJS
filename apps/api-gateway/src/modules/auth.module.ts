import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from '../controllers/auth.controller';
import { AuthProxyService } from '../services/auth-proxy.service';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [AuthProxyService],
})
export class AuthModule {}
