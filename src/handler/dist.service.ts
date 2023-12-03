import { Injectable } from '@nestjs/common'

const devby = require('devby')
const { join } = require("path")
const { existsSync, mkdirSync, readdirSync, lstatSync, writeFileSync } = require('fs')

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

    // 写文件到磁盘
    writeFileSync(filepath: string, data: any): void {

        let needMkdirPaths: Array<string> = [], tempPath = filepath

        while (true) {

            let currentPath = join(tempPath, "../")
            if (existsSync(currentPath)) {

                for (let index = 0; index < needMkdirPaths.length; index++) {
                    mkdirSync(needMkdirPaths[index])
                }
                writeFileSync(filepath, data)

                return
            } else {
                needMkdirPaths.unshift(currentPath)
                tempPath = currentPath
            }

        }

    }
}