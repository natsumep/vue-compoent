<template>
  <div style="margin: 0 auto; width: 700px; border: 1px solid red">
    <a-form
      :formConfig="formConfig"
      :formItem="formItems"
      :isLoading="false"
      @on-submit-form="submitFrom"
      @on-submit-error="submitFrom"
    ></a-form>
  </div>
  <!-- <router-view></router-view> -->
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import { Form } from "element-ui";
import { fromConfig, formItems } from "./config";
import AForm from "./components/AForm.vue";
@Component({
  components: {
    AForm,
  },
})
export default class Home extends Vue {
  formConfig = fromConfig;
  formItems = formItems;
  formValue = {
    name: "",
    check: [],
    time: [+new Date() - 60 * 60 * 24 * 1000 * 30, +new Date()],
    radio: "",
    upload: [],
    password: "",
    as:123,
  };
  submitFrom(data: any) {
    console.log(data);
  }
}
</script>

<style lang="stylus"></style>
