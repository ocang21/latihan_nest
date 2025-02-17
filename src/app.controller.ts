// filepath: /c:/Users/user/latihan-nest/src/app.controller.ts
import { Body, Controller, Delete, Get, Post, Put, Res, UploadedFile, BadRequestException, UseInterceptors, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody } from '@nestjs/swagger';
import { CreateMahasiswadto } from './dto/create-mahasiswa.dto';
import { RegisterUserDTO } from './dto/register-user.dto';
import { loginuserDTO } from './dto/login-user.dto';
import { Response } from 'express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('mahasiswa')
  getHello() {
    return this.appService.getMahasiswa(); // mengembalikan nilai array mahasiswa
  }

  @Post('register')
  @ApiBody({ type: RegisterUserDTO })
  RegisterUser(@Body() data: RegisterUserDTO) {
    return this.appService.register(data);
  }

  @Post('login')
  @ApiBody({ type: loginuserDTO })
  async loginUser(@Body() data: loginuserDTO, @Res({ passthrough: true }) res: Response) {
    const result = await this.appService.login(data);
    res.cookie('token', result.token);
    return result;
  }

  @Get('mahasiswa/:nim')
  getMahasiswaByNim(@Param('nim') nim: string) {
    return this.appService.getMahasiswaByNIM(nim);
  }

  @Post('mahasiswa')
  @ApiBody({ type: CreateMahasiswadto })
  createMahasiswa(@Body() data: CreateMahasiswadto) {
    return this.appService.addMahasiswa(data); // mengembalikan nilai array mahasiswa
  }

  @Delete('mahasiswa/:nim')
  deleteMahasiswa(@Param('nim') nim: string) {
    return this.appService.deleteMahasiswa(nim); // mengembalikan nilai array mahasiswa
  }

  @Put('mahasiswa/:nim')
  @ApiBody({ type: CreateMahasiswadto })
  editMahasiswa(@Param('nim') nim: string, @Body() data: CreateMahasiswadto) {
    return this.appService.updateMahasiswa(nim, data);
  }

  @Post('mahasiswa/upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File Tidak Boleh Kosong!!');
    return this.appService.uploadPhoto(file);
  }

  @Get('mahasiswa/photo/:id')
  async getPhoto(@Param('id') id: number, @Res() res: Response) {
    const photoFilename = await this.appService.getPhoto(id);
    const photoPath = `./uploads/${photoFilename}`;
    return res.sendFile(photoPath, { root: '.' });
  }
}