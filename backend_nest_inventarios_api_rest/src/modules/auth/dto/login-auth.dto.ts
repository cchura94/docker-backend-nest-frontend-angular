import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";

export class LoginAuthDto{
    
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @ApiProperty()
    @MinLength(6)
    @MaxLength(30)
    @IsNotEmpty()
    @Matches(/^[A-Za-z0-9]+$/)
    password: string;
}