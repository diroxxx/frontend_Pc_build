export type UserUpdateDto = {
    nickname: string | "",
    email: string | "",
    password: string | "",
    role?: UserRole

}

export enum UserRole {
    USER = "USER", ADMIN = "ADMIN",
}