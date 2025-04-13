import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { R2Service } from 'src/common/r2.service';

@Controller('/api')
export class UploadController {
  constructor(private readonly r2Service: R2Service) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const result = await this.r2Service.uploadFile(file);
    return {
      message: 'File uploaded successfully',
      url: result.url,
      key: result.key,
    };
  }
}
