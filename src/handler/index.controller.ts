import { Controller, Get, Post, Query, UploadedFile, UseInterceptors, Body } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { DistService } from './dist.service'

const devby = require('devby')
const { writeFileSync } = require('fs')
const { join } = require('path')

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

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    upload(@UploadedFile() file, @Body() body: any) {

        let targetPath = join(__dirname, '../../client/userspace', body.path, decodeURIComponent(body.filename))
        writeFileSync(targetPath, file.buffer)

        devby.warn(new Date().toLocaleString() + " 文件上传: ./" + join(body.path, decodeURIComponent(body.filename)))
        return {
            code: '000000',
            msg: "上传成功"
        }
    }
}
