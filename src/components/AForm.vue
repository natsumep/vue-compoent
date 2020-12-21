<template>
  <el-form
    class="a-form"
    :model="formValue"
    ref="ruleForm"
    :inline="formConfigVal.inline"
    :label-position="formConfigVal.labelPosition"
    :label-width="formConfigVal.labelWidth"
    :hide-required-asterisk="formConfigVal.hideRequiredAsterisk"
    :show-message="formConfigVal.showMessage"
    :size="formConfigVal.size"
    @submit.native.prevent
  >
    <template v-for="item in formItem">
      <el-form-item
        :label="item.label"
        :prop="item.prop"
        :key="item.prop"
        :rules="item.rules"
        :required="item.required"
        :error="item.error"
        :class="item.class ? item.class : ''"
        :style="{
          display: item.type === 'hidden' ? 'none' : '',
          width: item.itemWidth ? item.itemWidth : '',
        }"
      >
        <el-select
          v-if="item.type === 'select'"
          v-model="formValue[item.prop]"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
          @change="handleItemChange($event, item)"
          :style="{ width: item.width || '' }"
        >
          <el-option
            v-for="i in item.item"
            :label="i.label"
            :value="i.value"
            :key="i.value"
          ></el-option>
        </el-select>
        <el-checkbox-group
          v-else-if="item.type === 'checkbox'"
          :style="{ width: item.width || '' }"
          v-model="formValue[item.prop]"
          :disabled="item.disabled"
          @change="handleItemChange($event, item)"
        >
          <el-checkbox v-for="i in item.item" :label="i.value" :key="i.value">{{
            i.label
          }}</el-checkbox>
        </el-checkbox-group>
        <el-radio-group
          v-else-if="item.type === 'radio'"
          :style="{ width: item.width || '' }"
          v-model="formValue[item.prop]"
          :disabled="item.disabled"
          @change="handleItemChange($event, item)"
        >
          <el-radio v-for="i in item.item" :label="i.value" :key="i.value">{{
            i.label
          }}</el-radio>
        </el-radio-group>
        <el-date-picker
          v-else-if="item.type === 'time'"
          :style="{ width: item.width || '' }"
          v-model="formValue[item.prop]"
          :disabled="item.disabled"
          :type="item.dateType || 'daterange'"
          :clearable="false"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="item.pickerOptions || pickerOptions"
          @change="handleItemChange($event, item)"
        >
        </el-date-picker>
        <el-cascader
          v-else-if="item.type === 'cascader'"
          v-model="formValue[item.prop]"
          :style="{ width: item.width || '' }"
          :options="item.options"
          :disabled="item.disabled"
          @change="handleItemChange($event, item)"
          :props="item.props || {}"
        ></el-cascader>
        <el-input
          v-else-if="item.type === 'password'"
          :style="{ width: item.width || '' }"
          v-model="formValue[item.prop]"
          :disabled="item.disabled"
          :placeholder="item.placeholder"
          @change="handleItemChange($event, item)"
          show-password
        ></el-input>
        <el-input-number
          v-else-if="item.type === 'number'"
          :precision="item.precision"
          :min="item.min"
          :max="item.max"
          :disabled="item.disabled"
          :style="{ width: item.width || '' }"
          v-model="formValue[item.prop]"
          :placeholder="item.placeholder"
          controls-position="right"
          @change="handleItemChange($event, item)"
        ></el-input-number>
        <div
          v-else-if="item.type === 'upload'"
          :style="{ width: item.width || '' }"
        >
          <upload
            v-model="formValue[item.prop]"
            @change="handleItemChange($event, item)"
            :info="item.info"
          >
          </upload>
        </div>
        <el-input
          v-else-if="item.type === 'search'"
          :style="{ width: item.width || '' }"
          v-model="formValue[item.prop]"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
          @change="handleItemChange($event, item)"
        >
          <el-button
            @click="handleBtnClick"
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
        <el-input
          v-else-if="item.type === 'textarea'"
          :style="{ width: item.width || '' }"
          v-model="formValue[item.prop]"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
          type="textarea"
          :rows="item.rows || 4"
          :show-word-limit="!!item.maxLength"
          :maxlength="item.maxLength || null"
          @change="handleItemChange($event, item)"
        ></el-input>
        <el-input
          v-else
          :style="{ width: item.width || '' }"
          v-model="formValue[item.prop]"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
          :show-word-limit="!!item.maxLength"
          :maxlength="item.maxLength || null"
          type="text"
          @change="handleItemChange($event, item)"
        ></el-input>
      </el-form-item>
    </template>
    <el-form-item v-if="formConfigVal.needSubmit">
      <el-button
        type="primary"
        :loading="isLoading"
        :disabled="isLoading"
        @click="submitForm"
        >{{ formConfigVal.submitName || "提交" }}</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";
import Upload from "./Upload.vue";
import { Form } from "element-ui";
const formConfig: any = {
  inline: false,
  labelPosition: "right",
  labelWidth: "80px",
  hideRequiredAsterisk: false,
  showMessage: true,
  statusIcon: false,
  size: "small",
};

@Component({
  name: "a-from",
  components: {
    Upload,
  },
})
export default class Home extends Vue {
  @Prop({
    default: () => formConfig,
  })
  formConfig: any;
  @Prop({
    default: false,
  })
  isLoading!: boolean;
  @Prop({
    default: () => {
      return [];
    },
  })
  formItem: any;
  @Prop({
    default: () => {
      return {};
    },
  })
  formValue: any;

  @Watch("formConfig")
  changeVal(data) {
    this.formConfigVal = {
      ...formConfig,
      ...data,
    };
  }
  @Emit()
  onSubmitError(error: any) {}
  @Emit()
  onSubmitForm(data: any) {}
  @Emit()
  onFormChange(data: any) {}
  formConfigVal = formConfig;
  mounted() {
    this.changeVal(this.formConfig);
  }
  changeFile(arr: any, value: any) {
    this.formValue[value] = arr;
  }
  updated() {
  }
  pickerOptions = {
    shortcuts: [
      {
        text: "最近一周",
        onClick(picker: any) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit("pick", [start, end]);
        },
      },
      {
        text: "最近一个月",
        onClick(picker: any) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          picker.$emit("pick", [start, end]);
        },
      },
      {
        text: "最近三个月",
        onClick(picker: any) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          picker.$emit("pick", [start, end]);
        },
      },
    ],
  };
  submitForm() {
    (this.$refs.ruleForm as Form).validate((valid, error) => {
      if (valid) {
        this.onSubmitForm(this.formValue);
      } else {
        this.onSubmitError(error);
        return false;
      }
    });
  }
  handleBtnClick() {
    this.onFormChange(this.formValue);
    this.submitForm();
  }
  resetForm() {
    (this.$refs.ruleForm as Form).resetFields();
  }
  async validate() {
    return await (this.$refs.ruleForm as Form).validate();
  }
  handleItemChange(data, item: any) {
    item.change &&
      item.change(data, this.formValue, this.formItem, this.formConfig);
    this.onFormChange(this.formValue);
  }
}
</script>

<style scoped lang="less">
.a-form {
  /deep/ .el-date-editor .el-range-input {
    width: 35%;
  }
}
.a-form {
  /deep/ .el-date-editor .el-range-separator {
    width: 10%;
  }
}
</style>
