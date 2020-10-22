type checkObj  = {
    state:boolean,
    msg?:string
}


export  function checkHeadPortraitType(type:string):checkObj{
    if (!/(jpg|jpeg|png|bmp|JPG|PNG)$/.test(type)) {
        return {
            state:false,
            msg:"图片类型必须是jpeg、jpg、png、bmp中的一种"
        }
    }
    return {state:true}
};



export function getFileSuffix(fileName: string): string {
    if (!fileName) return "";
    let index = fileName.lastIndexOf(".");
    let lastIndex = fileName.lastIndexOf("?");
    lastIndex = lastIndex === -1?fileName.length:lastIndex;
    if(index>-1){
        return fileName.slice( index + 1, lastIndex).toLowerCase();
    }else{
        return "";
    }
}

const videoTypes = ['mp4','rm','mkv','rmvb','mpeg1-4' ,'mov', 'mtv', 'dat', 'wmv' ,'avi' ,'3gp' ,'amv' ,'dmv', 'flv'];   //后续看情况在拓展吧
const imageTypes = ['bmp',"jpeg",'jpg','png','tif','gif','pcx','tga','exif','fpx','svg','psd','cdr','pcd','dxf','ufo','eps','ai','raw','wmf','webp',"jfif"];


export function isVideo(filePath: string):boolean{
    let suffix = getFileSuffix(filePath);
    if(videoTypes.indexOf(suffix)>-1){    //如果是视频
        return true
    }else{
        return false
    }
}


export function isImage(filePath: string):boolean{
    let suffix = getFileSuffix(filePath);
    if(imageTypes.indexOf(suffix)>-1){    
        return true
    }else{
        return false
    }
}


/**
 * 获取单个文件的缩略图 这里只支持文件和视频
 */
export function getFileThumb(path:string):string{
    if(isImage(path)){    //如果是视频
        return path + "?x-oss-process=style/thumb";
    }else if(isVideo(path)){
        let lastIndex = path.lastIndexOf(".") + 1;
        return path.slice(0, lastIndex - 1) + "_compress.jpg";
    }else{
        return "";
    }
}

/**
 * 获取单个文件的缩略图 这里只支持文件和视频
 */
export function getFilesThumb(paths:string[]):string[]{
    return paths.map(item=>getFileThumb(item))
}

/**
 * 获取文件大小 （名称）   
 * @param value （b）
 */

export function getFileLength(value: number | string | void): string {
    if (null == value || value == '') {
        return "0 Bytes";
    }
    var unitArr = new Array("Bytes", "K", "M", "G", "T", "P", "E", "Z", "Y");
    var index = 0,
        srcsize = parseFloat(<string>value);
    index = Math.floor(Math.log(srcsize) / Math.log(1024));
    var size = srcsize / Math.pow(1024, index);
    //  保留的小数位数
    return size + unitArr[index];
};

/**
 * 判断是否为图片视频
 */
export function isImageOrVideo(fileName:string){
    let types  = [ ...videoTypes, ...imageTypes];
    let suffix = getFileSuffix(fileName);
    return types.indexOf(suffix)> -1;
}

/**
 * 判断文件类型
 */

export function getFileType (fileName:string){
    if(isVideo(fileName)){
        return "video"
    }else if( isImage(fileName)){
        return "img"
    }else{
        return "file"
    }
}
