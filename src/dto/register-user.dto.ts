import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  matches,
  Length,
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class RegisterUserDTO {
  @ApiProperty({
    description: 'Nama user',
    type: String,
    example: 'dirham',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\S*$/i)
  @Length(1, 30)
  username: string;

  @ApiProperty({
    description: 'Password',
    type: String,
    example: 'password',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\S*$/i)
  @Length(1, 30)
  password: string;
}