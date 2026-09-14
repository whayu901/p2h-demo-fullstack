import { Module } from '@nestjs/common';
import { SeedModule } from '../seed/seed.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [SeedModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
