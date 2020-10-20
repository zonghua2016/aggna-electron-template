/*
 * @Author       : tongzonghua
 * @Date         : 2020-10-21 00:57:10
 * @LastEditors  : tongzonghua
 * @LastEditTime : 2020-10-21 03:00:03
 * @Email        : tongzonghua@360.cn
 * @Description  : 
 * @FilePath     : /cli/aggna-electron-template/src/renderer/utils/db.js
 */

import Datastore from 'lowdb'
import LodashId from 'lodash-id'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fse from 'fs-extra'
import { remote, app } from 'electron'

const APP = process.type === 'renderer' ? remote.app : app
const STORE_PATH = APP.getPath('userData') // 获取用户目录
console.log(STORE_PATH)
if (process.type === 'renderer') {
    if (!fse.pathExistsSync(STORE_PATH)) {
        fse.mkdirpSync(STORE_PATH)
    }
}

const adapters = new FileSync(path.join(STORE_PATH, '/data.json'))
class DB {
    constructor() {
        this.db = Datastore(adapters)
        this.db._.mixin(LodashId)

        if (!this.db.has('global').value()) {
            this.db.set('global', []).write()
        }
    }
    // 强制读取最新数据
    read() {
        return this.db.read()
    }
    get(key = '') {
        return this.read().get(key).value()
    }
    set(key, value) {
        return this.read().set(key, value).write()
    }
    has(key) {
        return this.read().has(key).value()
    }
    insert(key, value) {
        return this.read().get(key).insert(value).write()
    }
    unset(key, value) {
        return this.read().get(key).unset(value).value()
    }
    getById(key, id) {
        return this.read().get(key).getById(id).value()
    }
    removeById(key, id) {
        return this.read().get(key).removeById(id).write()
    }
}

export default new DB()