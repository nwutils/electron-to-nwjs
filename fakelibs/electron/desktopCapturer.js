/*
  Electron Docs
  https://www.electronjs.org/docs/latest/api/desktop-capturer

  NW.js Docs
  https://docs.nwjs.io/en/latest/References/Chrome%20Extension%20APIs/
  https://developer.chrome.com/docs/extensions/reference/desktopCapture/

  Access information about media sources that can be used to capture audio and video
  from the desktop using the navigator.mediaDevices.getUserMedia API.
  Only available in the main process.

  ?
*/

class desktopCapturer {
  async getSources(options) { // {types:string[], thumbnailSize:{width:number, height:number}, fetchWindowIcons:boolean}
    return []
  }
}
module.exports = desktopCapturer