<template>
  <div>
    <el-upload
      v-if="info.isHeader"
      class="avatar-uploader"
      action="#"
      :show-file-list="info.showFileList || false"
      :before-upload="beforeAvatarUpload"
      :accept="info.accept || 'image/*'"
      :http-request="uploadFile"
      :file-list="fileList"
      :multiple="info.multiple || false"
      :limit="info.limit || 10"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>

    <el-upload
      v-else
      class="avatar-uploader"
      action="#"
      list-type="picture-card"
      :show-file-list="info.showFileList || true"
      :before-upload="beforeAvatarUpload"
      :accept="info.accept||'image/*'"
      :http-request="uploadFile"
      :file-list="fileList"
      :multiple="info.multiple || false"
      :limit="info.limit || 10"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit , Model ,Watch} from "vue-property-decorator";
import { Message } from "element-ui";
import { postFile } from "./post-file";

@Component
export default class Upload extends Vue {
  @Prop({
    default: () => {
      return {};
    },
  })
  private info!: any;
  private fileList:{name?:string,url:string}[] = [];
  @Model ('change', {type: Array,default:[]})  value!: string[];

  // @Watch('value')
  changeValue(newValue: string[]){
    console.log(newValue);
      this.fileList = newValue.map(url=>{
          return {
              url
          }
      })
  }
  mounted() {
    this.changeValue(this.value); 
  }
  postFileSuccess(value: string) {
    this.value.push(value)
    // this.fileList.push({url:value});
  }
  imageUrl: string = "";
  // 自定义上传
  uploadFile(data: any) {
    postFile.postFileToOss(data.file,{
      successFn:(...data: any)=>{
        this.postFileSuccess(data[0])
        if(this.info.isHeader){
          this.imageUrl = data[0];
        }
      },
      errorFn(...data: any){
        console.log(data);
      }
    });
    console.log(arguments);
  }
  beforeAvatarUpload(file: File) {
    if (file.type.indexOf("image/") == -1) {
      Message.error("选择的文件不是图片");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 100;
    if (!isLt2M) {
        Message.error("上传头像图片大小不能超过 100MB!");
        return isLt2M;
    }
  }
}
</script>
<style >
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 48px;
  height: 48px;
  line-height: 48px;
  text-align: center;
}

.avatar {
  width: 48px;
  height: 48px;
  display: block;
}
</style>
