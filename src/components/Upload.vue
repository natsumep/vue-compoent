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
      :limit="info.limit || 2"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>

    <el-upload
      ref="upload"
      v-else
      class="avatar-uploader"
      action="#"
      :list-type="info.listType || 'picture-card'"
      :show-file-list="true"
      :before-upload="beforeAvatarUpload"
      :accept="info.accept"
      :http-request="uploadFile"
      :file-list="fileList"
      :multiple="info.multiple || false"
      :limit="info.limit || 10"
      :on-success="onSuccess"
      :on-remove="onRemove"
      :on-progress="onprogress"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Emit,
  Model,
  Watch,
} from "vue-property-decorator";
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
  private fileList: { name?: string; url: string; [key: string]: any }[] = [];
  @Model("change", { type: Array, default: [] }) value!: string[];
  @Emit()
  change(list: any) {}

  @Watch("value")
  changeValue(newValue: string[]) {
    if (this.info.isHeader) {
      this.imageUrl = newValue[0] || "";
      this.fileList = newValue.map((url) => {
        return {
          url,
        };
      });
    }
    // this.fileList = newValue.map(url => {
    //   return {
    //     url
    //   };
    // });
  }
  mounted() {
    this.changeValue(this.value);
  }
  postFileSuccess(value: string) {
    if (this.info.isHeader) {
      this.value.splice(0, this.value.length);
      this.value.push(value);
    }
    // else{
    //   this.value.push(value);
    // }
    // this.fileList.push({url:value});
  }
  onSuccess(data, file, fileList) {
    // console.log(arguments);
    const index = fileList.findIndex((item) => item.uid === file.uid);
    if (index > -1) {
      fileList[index].url = data[0];
    }
    this.change(fileList);
  }
  onRemove() {
    console.log(arguments);
  }
  onprogress() {
    console.log(arguments);
  }
  imageUrl: string = "";
  // 自定义上传
  uploadFile(data: any) {
    return new Promise((a, b) => {
      postFile.postFileToOss(data.file, {
        successFn: (...data: any) => {
          this.postFileSuccess(data[0]);
          if (this.info.isHeader) {
            this.imageUrl = data[0];
          }
          a(data);
          // b()
        },
        errorFn(...data: any) {
          console.log(data);
          b();
          this.$message.error("文件上传失败，请重试")
        },
      });
    });

    // console.log(arguments);
  }
  beforeAvatarUpload(file: File) {
    if (this.info.isHeader && file.type.indexOf("image/") == -1) {
      Message.error("选择的文件不是图片");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 20;
    if (!isLt2M) {
      Message.error("上传头像图片大小不能超过 20MB!");
      return isLt2M;
    }
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
