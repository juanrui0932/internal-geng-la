import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MemesService } from './memes.service';
import { MemesController } from './memes.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ConfigModule, UsersModule],
  controllers: [MemesController],
  providers: [MemesService],
  exports: [MemesService],
})
export class MemesModule {}
