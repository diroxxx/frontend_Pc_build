export type UserUpdateDto = {
    id?: number,
    nickname: string | "",
    email: string | "",
    password: string | "",
    role?: UserRole

}

export enum UserRole {
    USER = "USER", ADMIN = "ADMIN",
}