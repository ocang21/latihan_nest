// filepath: /C:/Users/user/latihan-nest/src/app.service.ts
import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateMahasiswadto } from './dto/create-mahasiswa.dto';
import { RegisterUserDTO } from './dto/register-user.dto';
import { compareSync, hashSync } from 'bcrypt';
import { loginuserDTO } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { extname } from 'path';
import { PrismaClient } from '@prisma/client';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';

const prisma = new PrismaClient();

@Injectable()
export class AppService {
  constructor(private readonly jwtService: JwtService) {}

  async register(data: RegisterUserDTO) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username: data.username,
        },
      });

      if (user != null) {
        throw new BadRequestException("Username sudah digunakan");
      }
      console.log(data);

      const hash = hashSync(data.password, 10);

      const newUser = await prisma.user.create({
        data: {
          username: data.username,
          password: hash,
          role: "USER",
        },
      });
      return newUser;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException("ada masalah pada server");
    }
  }

  async uploadPhoto(file: Express.Multer.File) {
    try {
      const user = await prisma.user.findFirst({
        where: { username: 'defaultUser' }, // Ganti dengan logika untuk mendapatkan user yang sesuai
      });

      if (!user) {
        throw new NotFoundException('User tidak ditemukan');
      }

      if (user.foto_profile != null) {
        const oldFilePath = `./uploads/${user.foto_profile}`;
        if (existsSync(oldFilePath)) {
          rmSync(oldFilePath);
        }
      }

      const uploadPath = './uploads';
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }

      const fileExt = extname(file.originalname);
      const baseFilename = user.username;
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = `${baseFilename}-${uniqueSuffix}${fileExt}`;
      const filePath = `${uploadPath}/${filename}`;

      writeFileSync(filePath, file.buffer);
      await prisma.user.update({
        where: { id: user.id },
        data: { foto_profile: filename },
      });

      return { filename, path: filePath };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException("ada masalah pada server");
    }
  }

  async getPhoto(userId: number) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user || !user.foto_profile) {
        throw new NotFoundException("Foto tidak ditemukan");
      }
      return user.foto_profile;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException("ada masalah pada server");
    }
  }

  async auth(user_id: number) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: user_id
        }
      })
      if (user == null) throw new NotFoundException("User Tidak Ditemukan")
      return user
    } catch (err) {
      if (err instanceof HttpException) throw err
      throw new InternalServerErrorException("Terdapat Masalah Dari Server Harap Coba Lagi dalam beberapa menit")
    }
  }

  async login(data: loginuserDTO) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username: data.username,
        },
      });
      if (user === null) {
        throw new NotFoundException("userName yang anda masukkan salah");
      }

      if (compareSync(data.password, user.password) === false) {
        throw new BadRequestException("Password salah");
      }
      const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      const token = await this.jwtService.signAsync(payload);
      return {
        token: token,
        user,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException("Ada masalah pada server");
    }
  }

  async getMahasiswa() {
    return await prisma.mahasiswa.findMany();
  }

  async getMahasiswaByNIM(nim: string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({
      where: {
        nim,
      },
    });

    if (mahasiswa == null) throw new NotFoundException("Tidak Menemukan NIM");

    return mahasiswa;
  }

  async addMahasiswa(data: CreateMahasiswadto) {
    await prisma.mahasiswa.create({
      data,
    });

    return await prisma.mahasiswa.findMany();
  }

  async deleteMahasiswa(nim: string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({
      where: {
        nim,
      },
    });

    if (mahasiswa == null) {
      throw new NotFoundException("Tidak Menemukan NIM");
    }

    await prisma.mahasiswa.delete({
      where: {
        nim,
      },
    });

    return await prisma.mahasiswa.findMany();
  }

  async updateMahasiswa(nim: string, data: CreateMahasiswadto) {
    const mahasiswa = await prisma.mahasiswa.findFirst({
      where: { nim },
    });

    if (mahasiswa === null) {
      throw new NotFoundException("Mahasiswa dengan NIM tersebut tidak ditemukan.");
    }
    await prisma.mahasiswa.update({
      where: {
        nim,
      },
      data: data,
    });

    return await prisma.mahasiswa.findMany();
  }
}