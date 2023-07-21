const pkg = require('./package.json')
const { deleteSync, } = require('devby')
const fs = require('fs')

if (fs.existsSync('./client/lib')) {
    deleteSync('./client/lib')
}

fs.mkdirSync('./client/lib')
fs.copyFileSync('./node_modules/vislite/lib/index.umd.min.js', './client/lib/vislite.min.js')

fs.writeFileSync("./client/lib/system.info.js", `window.systemInfo = {
    "version": "${pkg.version}"
};`)


if (!fs.existsSync('./userspace')) {
    fs.mkdirSync('./userspace')
}