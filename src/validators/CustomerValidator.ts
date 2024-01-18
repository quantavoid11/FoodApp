import {IsAlpha, IsAlphanumeric, IsEmail, Length} from 'class-validator';

export class registerCustomerInput{
    @IsEmail()
    email:string;

    @Length(7,13)
    phoneNumber:string

    @Length(7,15)
    password:string

    @IsAlpha()
    name:string

    @IsAlphanumeric()
    address:string
}

export class loginCustomerInput{
    @IsEmail()
    email:string;

    @Length(7,15)
    password:string
}

export interface customerPayload{
    _id:string,
    name:string,
    email:string,
    verified:boolean
}