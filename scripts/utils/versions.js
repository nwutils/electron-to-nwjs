const semver = require('semver')

class Versions {
    static isVersionEqualOrSuperiorThanVersion(version1, version2) {
        return semver.gte(version1, version2)
    }
    static isVersionSuperiorThanVersion(version1, version2) {
        return semver.gt(version1, version2)
    }
    static doesVersionMatchesConditions(version, conditions) {
        return semver.satisfies(version, conditions || "*")
    }
}

module.exports = Versions