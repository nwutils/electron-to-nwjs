/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/native-image

  Create tray, dock, and application icons using PNG or JPG files.

  NW.js has no class equivalent to that one, so we gonna need to recreate that
  functionality manually using Node.

  Note: It loads an existing image by converting it to a bitmap buffer, which is
        raw bitmap pixel data, which can then be converted into PNG or JPEG.
*/

const fs = require('fs')

const throwUnsupportedException = require('./utils/unsupported-exception')

const isPngBuffer = function(buffer) {
    // TODO
    return true
}
const isJpgBuffer = function(buffer) {
    // TODO
    return false
}

class NativeImage {
    constructor() {
        this._buffer = Buffer.alloc(0)
        img._width = 0
        img._height = 0
        img._scaleFactor = 1.0
    }


    static get upngJs() {
        if (this._upngJs === undefined) {
            this._upngJs = require('upng-js')
        }
        return this._upngJs
    }
    static createEmpty() {
        return new NativeImage()
    }
    // static createThumbnailFromPath(path, maxSize) (Windows and macOS only)
    static createFromPath(filePath) {
        let buffer = fs.readFileSync(filePath, {encoding: "buffer"})
        return NativeImage.createFromBuffer(buffer)
    }
    static createFromBitmap(buffer, {width, height, scaleFactor}) {
        var img = new NativeImage()
        img._buffer = buffer
        img._width  = width
        img._height = height
        img._scaleFactor = scaleFactor || 1.0
        return img
    }
    static createFromBuffer(buffer, options) {
        let bitmap = null
        if (isPngBuffer(buffer)) {
            bitmap = NativeImage.upngJs.decode(buffer)
        }
        if (isJpgBuffer(buffer)) {
            // TODO
        }
        if (!bitmap) {
            throw new Error("Invalid buffer")
        }
        
        var img = new NativeImage()
        img._buffer = bitmap.data
        img._width  = options.width  || bitmap.width
        img._height = options.height || bitmap.height
        img._scaleFactor = options.scaleFactor || 1.0
        return img
    }
    static createFromDataURL(dataURL) {
        
    }
    // static createFromNamedImage(imageName[, hslShift]) (macOS only)



    toPNG(options) {
        if (options) {
            throwUnsupportedException("NativeImage.toPNG can't support the 'options' argument")
        }
        return NativeImage.upngJs.encode(this._buffer, this._width, this._height, 0)
    }
    toJPEG(quality) {
        return Buffer.alloc(0)
    }
    toBitmap(options) {
        if (options) {
            throwUnsupportedException("NativeImage.toBitmap can't support the 'options' argument")
        }
        let destBuf = Buffer.alloc(this._buffer.length)
        let oldBuf = this._buffer
        oldBuf.copy(destBuf)
        return destBuf
    }
    toDataURL(options) {
        return `data:image/png;base64,${this.toPNG(options).toString("base64")}`
    }
    getBitmap(options) {
        if (options) {
            throwUnsupportedException("NativeImage.toBitmap can't support the 'options' argument")
        }
        return this._buffer
    }
    // getNativeHandle() (macOS only)
    isEmpty() {
        return this._width === 0 || this._height === 0
    }
    // getSize([scaleFactor])
    // setTemplateImage(option)
    // isTemplateImage()
    // crop(rect)
    // resize(options)
    // getAspectRatio([scaleFactor])
    // getScaleFactors()
    // addRepresentation(options)
    // isMacTemplateImage (macOS only)

    _temporaryPngFilePath() {
        
    }
}

module.exports = NativeImage