import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException, Param } from '@nestjs/common';
import { CreateMahasiswadto } from './dto/create-mahasiswa.dto';
import prisma from './prisma';
import { RegisterUserDTO } from './dto/register-user.dto';
import { hash } from 'crypto';
import { compareSync, hashSync } from 'bcrypt';
import { loginuserDTO } from './dto/login-user.dto';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Injectable()

export class AppService {

  constructor(private readonly jwtService: JwtService) {

  }
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
      console.log(data)

      const hash = hashSync(data.password, 10);

      const newUser = await prisma.user.create({
        data: {
          username: data.username,
          password: hash,
          role: "USER"
        },
      });
      return newUser;

    } catch (error) {
      console.log(error)
      if (error instanceof HttpException) throw error
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

      // const isPasswordValid = hashSync(data.password, user.password);
      if (compareSync(data.password, user.password) === false) {
        throw new BadRequestException("Password salah");
      }
      const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
      }

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
        nim
      }
    })

    if (mahasiswa == null)
      throw new NotFoundException("Tidak Menemukan NIM")

    return mahasiswa

  }

  async addMahasiswa(data: CreateMahasiswadto) {
    await prisma.mahasiswa.create({
      data
    })

    return await prisma.mahasiswa.findMany()
  }

  async deleteMahasiswa(nim: string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({
      where: {
        nim
      }
    })

    if (mahasiswa == null) {
      throw new NotFoundException("Tidak Menemukan NIM")
    }

    await prisma.mahasiswa.delete({
      where: {
        nim
      }
    })

    return await prisma.mahasiswa.findMany()
  }

  async updateMahasiswa(nim: string, data: CreateMahasiswadto) {
    // Cari mahasiswa berdasarkan NIM
    const mahasiswa = await prisma.mahasiswa.findFirst({
      where: { nim },
    });


    // Jika tidak ditemukan, lemparkan error
    if (mahasiswa === null) {
      throw new NotFoundException("Mahasiswa dengan NIM tersebut tidak ditemukan.");
    }
    await prisma.mahasiswa.update({
      // Perbarui data mahasiswa
      where: {
        nim

      },
      data: data
    });

    // Kembalikan data mahasiswa yang diperbarui
    return await prisma.mahasiswa.findMany();
  }
}