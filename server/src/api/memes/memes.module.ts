import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MemesService } from './memes.service';
import { MemesController } from './memes.controller';

@Module({
  imports: [ConfigModule],
  controllers: [MemesController],
  providers: [MemesService],
  exports: [MemesService],
})
export class MemesModule {}
