// Reference:
// https://www.electronjs.org/de/docs/latest/api/native-image

// Bitmap buffer = raw bitmap pixel data

const throwUnsupportedException = require('./unsupported-exception')

class NativeImage {
    constructor() {
        this._buffer = Buffer.alloc(0)
    }

    static createEmpty() {
        return new NativeImage()
    }
    // static createThumbnailFromPath(path, maxSize) (Windows and macOS only)
    static createFromPath(filePath) {
        var img = new NativeImage()
        // https://www.npmjs.com/package/upng-js
        return img
    }
    static createFromBitmap(buffer, {width, height, scaleFactor}) {
        var img = new NativeImage()
        img._buffer = buffer
        return img
    }
    static createFromBuffer(buffer, options) {
        var img = new NativeImage()
        // img._buffer = buffer
        return img
    }
    // static createFromDataURL(dataURL)
    // static createFromNamedImage(imageName[, hslShift]) (macOS only)

    toPNG(options) {
        if (options) {
            throwUnsupportedException("NativeImage.toPNG can't support the 'options' argument")
        }
        // https://www.npmjs.com/package/upng-js
        return Buffer.alloc(0)
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
        return this._buffer.length === 0
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
}

module.exports = NativeImage