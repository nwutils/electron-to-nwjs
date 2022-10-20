// Reference:
// https://www.electronjs.org/de/docs/latest/api/native-image

class NativeImage {
    static createEmpty() {
        return new NativeImage()
    }
    // static createThumbnailFromPath(path, maxSize) (Windows and macOS only)
    static createFromPath(filePath) {
        var img = new NativeImage()
        return img
    }
    // static createFromBitmap(buffer, options)
    // static createFromBuffer(buffer[, options])
    // static createFromDataURL(dataURL)
    // static createFromNamedImage(imageName[, hslShift]) (macOS only)

    // toPNG([options])
    // toJPEG(quality)
    // toBitmap([options])
    toDataURL() {
        return ""
    }
    // getBitmap([options])
    // getNativeHandle() (macOS only)
    // isEmpty()
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