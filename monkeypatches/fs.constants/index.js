
// Reference:
// https://nodejs.org/docs/latest-v19.x/api/fs.html#fsconstants

let constants = [
    "F_OK",
    "R_OK",
    "W_OK",
    "X_OK",

    "COPYFILE_EXCL",
    "COPYFILE_FICLONE",
    "COPYFILE_FICLONE_FORCE",
    
    "O_RDONLY",
    "O_WRONLY",
    "O_RDWR",
    "O_CREAT",
    "O_EXCL",
    "O_NOCTTY",
    "O_TRUNC",
    "O_APPEND",
    "O_DIRECTORY",
    "O_NOATIME",
    "O_NOFOLLOW",
    "O_SYNC",
    "O_DSYNC",
    "O_SYMLINK",
    "O_DIRECT",
    "O_NONBLOCK",
    "UV_FS_O_FILEMAP",

    "S_IFMT",
    "S_IFREG",
    "S_IFDIR",
    "S_IFCHR",
    "S_IFBLK",
    "S_IFIFO",
    "S_IFLNK",
    "S_IFSOCK",
    
    "S_IRWXU",
    "S_IRUSR",
    "S_IWUSR",
    "S_IXUSR",
    "S_IRWXG",
    "S_IRGRP",
    "S_IWGRP",
    "S_IXGRP",
    "S_IRWXO",
    "S_IROTH",
    "S_IWOTH",
    "S_IXOTH"
]

let constantsMap = {}
constants.forEach(c => constantsMap[c] = c)

var fs = require('fs')
fs.constants = constantsMap
