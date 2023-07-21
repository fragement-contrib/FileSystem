import { Injectable } from '@nestjs/common'

const fs = require('fs')
const path = require('path')

// 磁盘操作服务

let contextPath = path.join(process.cwd(), './') // 可操作目录根路径

@Injectable()
export class DistService {

    // 获取文件列表
    getFileList(filePath: string): any {

        // 读取子文件
        const subFiles = fs.readdirSync(path.join(contextPath, filePath))

        let resultData = []
        for (let index = 0; index < subFiles.length; index++) {
            resultData.push({
                name: subFiles[index],
                isDirectory: fs.lstatSync(path.join(contextPath, filePath, subFiles[index])).isDirectory()
            })
        }

        return resultData
    }
}