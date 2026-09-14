import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SafetyTalkEntity } from './safety-talk.entity';
import { SafetyTalksService } from './safety-talks.service';
import { SafetyTalksController } from './safety-talks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SafetyTalkEntity])],
  controllers: [SafetyTalksController],
  providers: [SafetyTalksService],
  exports: [SafetyTalksService],
})
export class SafetyTalksModule {}
