import { UserRole } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";

export class User {
    @Expose()
    id: number;

    @Expose()
    username: string;

    @Expose()
    password: string;

    @Expose()
    role: string;

}