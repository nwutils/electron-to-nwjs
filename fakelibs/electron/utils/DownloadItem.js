class DownloadItem {
    constructor(url) {
        this._url = url

        let xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
        this._xmlhttp = xmlhttp
    }

    getURL() {
        return this._url
    }
}

module.exports = DownloadItem