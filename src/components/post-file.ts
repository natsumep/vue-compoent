const token = '3285BAEEDE3637FD326F8A0A57719B873D12EAFF74536694597D8132B5C8C9489E1D60B531429B00A91C2204D45A18AF76586CDE6B798B4EAAFC4AEDB51E0D837177BB35C3C31CA101B1833697080CC8CCD5E28AC09A9899BBA0789288EE46E7493AC6AD080BBBCDF41F4F1A884C2FBC775B9034C3DFF5EB52CF41A1AB2F1F60E02022A9A3D4732CE4AA6C97C6A56B278DA71BE267048977A50C736C985D2BAE2A3918BFFAA718669C102B3B345F6BA1F58F79D20F381ED70BC91D9F54D24B6608A7A9E307997F65EE71FD544B3A7613B6E666E31D93311508035C593E7907C61F740C345F7AC581DF10D1EAEC7935A7641621D51908355D18B2F5A0A1ABF96E17AB3CFCB3ADE9E56B0AE845A336074674E6D7BE443A7C7D66640647F14DD68C4290A4043C4165A6240C46A8CE021778';

import OSS from "ali-oss";
import axios from "axios"
import { getFileLength, getFileSuffix } from "./file-utils";

const MAX_FILE_LENGTH = 100 * 1024 * 1024;  // 最大文件限制

class UploadFileToOssService {
    postFileToOss(files: Blob | File | FileList | File[], option: any={}) {
        if (!Array.isArray(files)) {
            files = [files as File];
        } else if (files instanceof FileList) {
            files = [...files];
        }
        this.getKey(files, option);
    }

    private getKey(files: File[], option: any) {
        for (let i = 0; i < files.length; i++) {
            const checkStats: {
                stats: boolean,
                msg?: string
            } = this.checkFileType(files[i], option);
            if (!checkStats.stats) {
                option.errorFn && option.errorFn({
                    type: "typeError",
                    msg: checkStats.msg
                });
                return false;
            }
        }
        axios.get("http://106.52.61.209:29090/homeCare/system/oss/getOSSAssumeRole",{
            params:{
                token,
            }
        }).then((result: any) => {
            const data = result.data.body;
            option.getKeyOkFn && option.getKeyOkFn(data);
            this.getKeySuccessEvt(data, files, option);
        }, (e: any) => {
            option.getKeyErrorFn && option.getKeyErrorFn(e);
            option.errorFn && option.errorFn({
                type: "keyError",
                error: e
            });
        });
    }

    private getKeySuccessEvt(result: any, file: any, option: any) {
        if (!Array.isArray(file)) {
            file = [file];
        }
        const client = new (OSS as any)({
            accessKeyId: result.accessKeyId,
            accessKeySecret: result.accessKeySecret,
            stsToken: result.securityToken,
            // success_action_status : '200', //让服务端返回200,不然，默认会返回204
            // endpoint:"oss-cn-shenzhen.aliyuncs.com",
            region: 'oss-cn-shenzhen',
            secure: true,
            bucket: result.bucket || "shili-hlxj",
            // 阿里oss的包promise 的polyfills和angular的promise 实现有冲突 然后@ types / ali-oss类型定义中缺失了对应的field S
            // 官方后续更新在改吧 
            // TODO: 
            // useFetch: false
        });
        for (let i = 0; i < file.length; i++) {
            file[i].customPreName = result.prefix;
            this.postFile(client, file[i], option, i);
        }
    }
    // 生成一个与图片对应的id 防止同时传多个文件的时候 无法找到对应的图片
    private getSymbol(_symbol: string | number, index: string | number): string {
        let symbolStr = "";
        if (_symbol) {
            symbolStr = _symbol + "" + index;
        } else {
            symbolStr += index;
        }
        return symbolStr;
    }

    private postFile(client: OSS, file: any, option: any, i: any) {
        const maxFileLength = option.maxFileLength || MAX_FILE_LENGTH;
        const _sym = this.getSymbol(option.symbol||"", i);
        if (file.size > maxFileLength) {
            const fileSizeFormat = getFileLength(maxFileLength);
            const _option = {
                msg: `存在上传的文件超过${fileSizeFormat}最大限制,请保持文件低于${fileSizeFormat}`,
                fileLength: file.size,
                fileSizeFormat,
                sym: _sym,
                file,
                type: "maxLengthError"
            };
            if (option.onMaxFileError) {
                option.onMaxFileError(_option);
            }
            option.errorFn && option.errorFn(_option);
            return;
        }
        if (option.startUploadFn) {
            const windowURL = window.URL || (window as any).webkitURL;
            const src = windowURL.createObjectURL(file);
            option.startUploadFn(_sym, src, file);
        }

        const fileValue = file.value || file.name || " ";
        const _name = fileValue.substr(0, fileValue.lastIndexOf("."));
        const suffix = fileValue.substr(fileValue.lastIndexOf("."));
        let postFileName = option.name;
        if (!postFileName) {
            postFileName = this.transfromFileName(_name);
        } else {
            if (option.needCode) {
                postFileName = this.transfromFileName(postFileName);
            }
        }
        postFileName = `${postFileName}${suffix}`;
        const callBack: OSS.MultipartUploadOptions = {
            partSize: 1024 * 50 * 1024
        };
        option.progress && (callBack.progress = option.progress.bind(null, _sym));
        client.multipartUpload(postFileName, file, callBack).then((result: any) => {
            let rqUrl = "";
            if (result.res.requestUrls[0].lastIndexOf("?") !== -1) {
                rqUrl = result.res.requestUrls[0].substr(0, result.res.requestUrls[0].lastIndexOf("?"));
            } else {
                rqUrl = result.res.requestUrls[0];
            }
            option.successFn && option.successFn(rqUrl, result, _sym, {file,fileLength:file.size});
        }).catch((err) => {
            option.OssErrorFn && option.OssErrorFn(err, _sym);
            option.errorFn && option.errorFn({
                sym: _sym,
                error: err,
                type: "ossError",
                file
            });
            console.log(err);
        });
    }
    private transfromFileName(name: string): string {
        // const ecodeName = encodeURI(name);   // oss bug 如果不编码  oss encode一次 然后在前面填个+号（！！！）；
        const mydate = new Date();
        // return ecodeName 
        return name +
            "DDD" +
            Math.round(Math.random() * 10000);
    }
    private getCheckName(arr: any) {
        const msgArr: any = [];
        arr.forEach((item: any) => {
            msgArr.push(item.name);
        });
        return msgArr.join("、");
    }
    private checkFileType(file: File, option?: any) {
        option && option.typeArr && option.typeArr.length || (option = {
            typeArr: []
        });
        if (!(option.typeArr as []).length) { return { stats: true }; }   // 如果没有 表示不校验
        let flag = !0;
        for (let i = 0; i < (option.typeArr as []).length; i++) {
            const item = (option.typeArr as [])[i] as any;
            if (item.type && (file.type.indexOf(item.type) != -1)) {
                flag = !1;
                break;
            }
        }
        let msg = '';
        if (flag) {
            msg = this.getCheckName(option.typeArr);
            // layer.alert();
            msg = `请上传 ${msg || "指定类型"} 文件！`;
            option.typeErrorFn && option.typeErrorFn(msg);
        }
        return {
            stats: !flag,
            msg
        };
    }


}



export const postFile = new UploadFileToOssService();