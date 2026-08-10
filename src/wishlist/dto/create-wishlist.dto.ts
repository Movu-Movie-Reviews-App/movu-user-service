import { IsUUID } from "class-validator";

export class CreateWishlistDto {

    @IsUUID()
    userId: string

    @IsUUID()
    contentId: string;


}
