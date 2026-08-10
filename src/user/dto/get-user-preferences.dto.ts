import { IsString, IsUUID } from "class-validator"


export class GetUserPreferencesDto {

    @IsUUID()
    userId: string

    @IsUUID()
    contentId: string[]

} 