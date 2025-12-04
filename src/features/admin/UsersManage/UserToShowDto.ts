import type {UserRole} from "./UserUpdateDto.ts";

export type UserToShowDto = {
    nickname: string,
    email: string,
    role: UserRole
}