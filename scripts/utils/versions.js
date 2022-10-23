class Versions {
    static compare(version1, version2) {
        if (version1 === undefined || version2 === undefined) {
            throw new Exception("Can't compare an undefined version")
        }
        var versionComp1 = String(version1).split('.');
        var versionComp2 = String(version2).split('.');

        while (versionComp1.length < versionComp2.length) versionComp1.push("0");
        while (versionComp2.length < versionComp1.length) versionComp2.push("0");
        
        for (var x = 0; x < versionComp1.length; x++)
        {
            var versionComp1Num = parseInt(versionComp1[x]);
            var versionComp2Num = parseInt(versionComp2[x]);
            if (versionComp1Num != NaN && versionComp2Num != NaN) {
                if (versionComp1Num < versionComp2Num) return  1;
                if (versionComp1Num > versionComp2Num) return -1;
            }
            
            if (versionComp1[x].length < versionComp2[x].length) return  1;
            if (versionComp1[x].length > versionComp2[x].length) return -1;
        }
        
        return 0;
    }

    static isVersionEqualOrSuperiorThanVersion(version1, version2) {
        return this.compare(version1, version2) !== 1;
    }
    static isVersionSuperiorThanVersion(version1, version2) {
        return this.compare(version1, version2) === -1;
    }
}

module.exports = Versions