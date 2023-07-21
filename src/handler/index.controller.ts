import { Controller, Get, Query } from '@nestjs/common'
import { DistService } from './dist.service'

@Controller('/handler')
export class HandlerController {
    constructor(private readonly distService: DistService) { }

    @Get('/queryAll')
    queryAll(@Query() query: {
        path: string
    }): any {
        return {
            code: '000000',
            filelist: this.distService.getFileList(query.path)
        }
    }

}
