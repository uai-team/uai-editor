const fileTypes: Record<string, string[]> = {
    ai: ['ai', 'eps'],
    app: ['app'],
    axure: ['rp'],
    book: ['mobi', 'oeb', 'lit', 'xeb', 'ebx', 'rb', 'pdb', 'epub', 'azw3', 'hlp', 'chm', 'wdl', 'ceb', 'abm', 'pdg', 'caj'],
    css: ['css', 'less', 'sass'],
    dmg: ['dmg'],
    excel: ['csv', 'fods', 'ods', 'ots', 'xls', 'xlsm', 'xlsx', 'xlt', 'xltm', 'xltx', 'et', 'ett'],
    exe: ['exe'],
    font: ['eot', 'otf', 'fon', 'font', 'ttf', 'ttc', 'woff', 'woff2'],
    html: ['htm', 'html', 'mht'],
    img: ['png', 'bmp', 'jpg', 'jpeg', 'gif', 'webp', 'tga', 'exif', 'fpx', 'svg', 'hdri', 'raw', 'ico', 'jfif', 'dib', 'pbm', 'pgm', 'ppm', 'rgb'],
    java: ['jar', 'java'],
    js: ['js', 'jsx', 'ts', 'tsx'],
    json: ['json'],
    keynote: ['key'],
    md: ['md', 'markdown'],
    music: ['au', 'aif', 'aiff', 'aifc', 'rmi', 'mp3', 'mid', 'cda', 'wav', 'wma', 'ra', 'ram', 'snd', 'mida', 'ogg', 'ape', 'flac', 'aac'],
    numbers: ['numbers'],
    pages: ['pages'],
    pdf: ['pdf'],
    php: ['php'],
    pkg: ['pkg'],
    ppt: ['fodp', 'odp', 'otp', 'pot', 'potm', 'potx', 'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx', 'dps', 'dpt', 'wpp'],
    psd: ['psd'],
    python: ['python', 'py'],
    sh: ['sh'],
    sketch: ['sketch'],
    sql: ['sql'],
    text: ['text', 'txt'],
    video: ['mp4', 'avi', 'mov', 'rmvb', 'rm', 'flv', 'mpeg', 'wmv', 'mkv'],
    vue: ['vue'],
    word: ['doc', 'docm', 'docx', 'dot', 'dotm', 'dotx', 'epub', 'fodt', 'odt', 'ott', 'rtf', 'wps', 'wpt'],
    xmind: ['xmind'],
    zip: ['zip', 'rar', 'tar', 'gz', 'gzip', 'uue', 'bz2', 'iso', '7z', 'z', 'ace', 'lzh', 'arj', 'cab'],
}

export const getFileExtname = (filename: string) => {
    const splitFileName = filename?.split('.')
    return splitFileName ? splitFileName[splitFileName.length - 1] : undefined
}

export const getFileIcon = (filename: string) => {
    let iconName = 'common'
    const extname = getFileExtname(filename)
    if (extname) {
        for (const type of Object.keys(fileTypes)) {
            if (fileTypes[type].includes(extname)) {
                iconName = type
            }
        }
    }
    return iconName
}

export const base64ToBlob = (fileBase64: string, fileType: string) => {
    if (fileBase64.startsWith("data")) {
        fileBase64 = fileBase64.split(",")[1];
    }
    let raw = atob(fileBase64);
    let rawLength = raw.length;
    let uint8Array = new Uint8Array(rawLength);
    while (rawLength--) {
        uint8Array[rawLength] = raw.charCodeAt(rawLength);
    }
    return new Blob([uint8Array], { type: fileType });
}