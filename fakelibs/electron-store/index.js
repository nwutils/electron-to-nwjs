const fs = require('fs')
const path = require('path')
const electron = require('../electron')

class Store {
    constructor(opts) {
        this._beforeEachMigration = opts.beforeEachMigration
        this._name = opts.name || 'config'
        this._cwd = opts.cwd || electron.app.getPath('userData')
        this._encryptionKey = opts.encryptionKey
        this._fileExtension = opts.fileExtension || 'json'
        this._clearInvalidConfig = opts.clearInvalidConfig === undefined ? false : opts.clearInvalidConfig
        this._serialize = opts.serialize || (value => JSON.stringify(value, null, '\t'))
        this._deserialize = opts.deserialize || (JSON.parse)
        this._accessPropertiesByDotNotation = opts.accessPropertiesByDotNotation === undefined ? true : opts.accessPropertiesByDotNotation
        this._watch = opts.watch === undefined ? false : opts.watch

        this.size = 0
        this.path = path.join(this._cwd, this._name + "." + this._fileExtension)
        this.store = {}
        if (fs.existsSync(this.path)) {
            const contentsStr = fs.readFileSync(this.path)
            this.store = this._deserialize(contentsStr)
        }
    }

    _save() {
        fs.writeFileSync(this.path, this._serialize(this.store), {encoding:'utf-8'})
    }

    set(key, value) {
        if (typeof key === "string") {
            this.store[key] = value
        }
        else {
            const that = this
            Object.keys(key).forEach(k => {
                that.store[k] = key[k]
            })
        }
        this._save()
    }
    get(key, defaultValue) {
        return this.store[key] || defaultValue
    }
    has(key) {
        return this.store[key] !== undefined
    }
    delete(key) {
        delete this.store[key]
        this._save()
    }
}

module.exports = Store