import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MemesModule } from './memes/memes.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
    MemesModule,
    CommentsModule,
  ],
})
export class ApiModule {}
