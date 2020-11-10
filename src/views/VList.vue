<template>
  <div style="padding:20px;position: relative;">
    <el-row :gutter="20" style="overflow:hidden;" >
      <template v-for="(item,index) in list" >
        <el-col :key="index" :span="4" v-if="!isHidden || index < 6" >
         <div class="grid-content bg-purple">
          <div class="more" @click="isHidden = false" v-if="isHidden && index===5">
            <span> +{{ 16 - 4}}</span>
          </div>
          <div class="more" @click="isHidden = true" v-if="list.length > 6 && index === list.length-1">
            <span>收起</span>
          </div>
        </div>
      </el-col>
      </template>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {
  list = Array.from( new Array(9)).map(a=>"")
  isHidden = this.list.length >6;

}
</script>
<style  scoped>
 .el-row {
    margin-bottom: 20px;
   
  }
 .el-row:last-child {
      margin-bottom: 0;
    }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    margin-bottom: 20px;
    position: relative;
  }
  .grid-content::after{
    content:"";
    display: flex;
    padding-bottom:100%
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .more{
    position: absolute;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    color: #eee;
    cursor: pointer;
  }
</style>