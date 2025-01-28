import { Body, Controller, Delete, Get, Post, Param, Put, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CreateMahasiswadto } from './dto/create-mahasiswa.dto';
import { RegisterUserDTO } from './dto/register-user.dto';
import { loginuserDTO } from './dto/login-user.dto';
import { type } from 'os';
import { Response } from 'express';
import { UserDecorator } from './user.decorator';
import { AuthGuard } from './auth.guard';
import { User } from '@prisma/client';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("mahasiswa")
  getHello() {
    return this.appService.getMahasiswa();//mengembalikan nilai array mahasiswa
  }
  @Post("register")
  @ApiBody({
    type: RegisterUserDTO
  })
  RegisterUser(@Body() data: RegisterUserDTO) {
    return this.appService.register(data);
  }

  @Get("/auth")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  auth(@UserDecorator() user: User) {
    return user
  }

  @Post("login")
  @ApiBody({ type: loginuserDTO })
  async loginUser(@Body() data: loginuserDTO,
    @Res({ passthrough: true }) res: Response) {
    const result = await this.appService.login(data);
    res.cookie("token", result.token);
    return this.appService.login(data);
  }


  @Get("mahasiswa/:nim")
  getMahasiswaByNim(@Param("nim") nim: string) {
    return this.appService.getMahasiswaByNIM(nim);
  }

  @Post("mahasiswa")
  @ApiBody({ type: CreateMahasiswadto })
  createMahasiswa(@Body() data: CreateMahasiswadto) {//mengambil data dari CreateMahasiswaDTO
    return this.appService.addMahasiswa(data);//mengembalikan nilai array mahasiswa

  }
  //DELETE localhost:3000/mahasiswa/105841106922
  @Delete("mahasiswa/:nim")
  deleteMahasiswa(@Param("nim") nim: string) {//membuat method deleteMahasiswa
    return this.appService.deleteMahasiswa(nim);//baris ini akan mengembalikan nilai array mahasiswa
  }

  @Put("mahasiswa/:nim")
  @ApiBody({ type: CreateMahasiswadto })
  editMahasiswa(@Param("nim") nim: string, @Body() data: CreateMahasiswadto) {
    return this.appService.updateMahasiswa(nim, data);
  }
}