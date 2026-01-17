import { ApiProperty } from "@nestjs/swagger";
import { from } from "rxjs";

export class getEventsDto {
    @ApiProperty({
        description: 'fromBlock',
        example: 50616000
    })
    fromBlock: number

    @ApiProperty({
        description: 'toBlock',
        example: 50617000
    })
    toBlock: number
}