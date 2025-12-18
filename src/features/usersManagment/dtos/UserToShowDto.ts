import type {UserRole} from "./UserUpdateDto.ts";

export type UserToShowDto = {
    id: number,
    nickname: string,
    email: string,
    role: UserRole
}