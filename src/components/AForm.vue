<template>
  <el-form
    :model="formValue"
    ref="ruleForm"
    :inline="formConfig.inline"
    :label-position="formConfig.labelPosition"
    :label-width="formConfig.labelWidth"
    :hide-required-asterisk="formConfig.hideRequiredAsterisk"
    :show-message="formConfig.showMessage"
    :size="formConfig.size"
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
        :style="{
          display: item.type === 'hidden' ? 'none' : '',
          width: item.width || 'auto',
        }"
      >
        <el-select
          v-if="item.type === 'select'"
          v-model="formValue[item.prop]"
          :placeholder="item.placeholder"
          @change="item.change&&itemChange($event,formValue)"
        >
          <el-option
            v-for="i in item.item"
            :label="item.label"
            :value="i.value"
            :key="i.value"
          ></el-option>
        </el-select>
        <el-checkbox-group
          v-else-if="item.type === 'checkbox'"
          v-model="formValue[item.prop]"
          @change="item.change&&itemChange($event,formValue)"
        >
          <el-checkbox v-for="i in item.item" :label="i.value" :key="i.value">{{
            i.label
          }}</el-checkbox>
        </el-checkbox-group>
        <el-radio-group
          v-else-if="item.type === 'radio'"
          v-model="formValue[item.prop]"
          @change="item.change&&itemChange($event,formValue)"
        >
          <el-radio v-for="i in item.item" :label="i.value" :key="i.value">{{
            i.label
          }}</el-radio>
        </el-radio-group>
        <el-date-picker
          v-else-if="item.type === 'time'"
          v-model="formValue[item.prop]"
          type="daterange"
          :clearable="false"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @change="item.change&&itemChange($event,formValue)"
        >
        </el-date-picker>
        <el-cascader
          v-else-if="item.type === 'cascader'"
          v-model="formValue[item.prop]"
          :options="item.options"
          @change="item.change&&itemChange($event,formValue)"
          :props="{ expandTrigger: item.trigger || 'hover' }"
        ></el-cascader>
        <el-input
          v-else-if="item.type === 'password'"
          v-model="formValue[item.prop]"
          :placeholder="item.placeholder"
          @change="item.change&&itemChange($event,formValue)"
          show-password
        ></el-input>
        <div v-else-if="item.type === 'upload'">
          <upload v-model="formValue[item.prop]"   @change="item.change&&itemChange($event,formValue)" :info="item.info"> </upload>
        </div>
        <el-input
          v-else-if="item.type === 'search'"
          v-model="formValue[item.prop]"
          :placeholder="item.placeholder"
          @change="item.change&&itemChange($event,formValue)"
        >
          <el-button @click="submitForm" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-input
          v-else
          v-model="formValue[item.prop]"
          :placeholder="item.placeholder"
          @change="item.change&&itemChange($event,formValue)"
        ></el-input>
      </el-form-item>

    </template>
    <el-form-item>
      <el-button type="primary" :loading='isLoading' :disabled="isLoading" v-if="formConfig.needSubmit" @click="submitForm" >提交</el-button>
    </el-form-item>

  </el-form>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import Upload from "./Upload.vue";
import { Form } from "element-ui";
const formConfig: any = {
  inline: false,
  labelPosition: "right",
  labelWidth: "80px",
  hideRequiredAsterisk: false,
  showMessage: false,
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
  @Emit()
  onSubmitError(error:any){}
  @Emit()
  onSubmitForm(data: any){}
  mounted() {
    console.log(this);
  }
  changeFile(arr:any,value: any){
    this.formValue[value] = arr;
  }
  updated() {
    console.log(this);
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
  submitForm(formName: any) {
    (this.$refs.ruleForm as Form).validate((valid,error) => {
      if (valid) {
        this.onSubmitForm(this.formValue);
      } else {
        this.onSubmitError(error);
        return false;
      }
    });
  }
  resetForm(formName: any) {
    (this.$refs.ruleForm as Form).resetFields();
  }
}
</script>

<style lang="stylus"></style>
