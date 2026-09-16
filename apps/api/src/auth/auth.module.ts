import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { PeranGuard } from './peran.guard';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    // Order matters: AuthGuard populates request.pengguna before PeranGuard reads it.
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: PeranGuard },
  ],
  exports: [AuthService],
})
export class AuthModule {}
