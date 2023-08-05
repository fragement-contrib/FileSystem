import { Injectable } from '@nestjs/common'

const devby = require('devby')
const { join } = require("path")
const { existsSync, mkdirSync, readdirSync, lstatSync } = require('fs')

// 磁盘操作服务

let contextPath = join(__dirname, '../../client/userspace') // 可操作目录根路径
if (!existsSync(contextPath)) {
    mkdirSync(contextPath)
}

@Injectable()
export class DistService {

    // 获取文件列表
    getFileList(filePath: string): any {
        devby.log(new Date().toLocaleString() + " 当前访问: " + filePath)

        // 读取子文件
        const subFiles = readdirSync(join(contextPath, filePath))

        let resultData = []
        for (let index = 0; index < subFiles.length; index++) {
            resultData.push({
                name: subFiles[index],
                isDirectory: lstatSync(join(contextPath, filePath, subFiles[index])).isDirectory()
            })
        }

        return resultData
    }
}