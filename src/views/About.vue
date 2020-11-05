<template>
	<div style="display:flex;">
		<block
			@on-to-item="itemClick($event,1)"
      @on-left-click="itemLeftClick"
      :activeId="activeId"
			:index="index1"
			:data="block1"
      :left = "true"
		></block>
		<block
			@on-to-item="itemClick($event,2)"
      @on-close-click="itemCloseClick"
			:index="index2"
			v-if="block2"
			:data="block2"
      :right = "true"
		></block>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { data } from "./data";
import Block from "./Block.vue";
import { Message} from "element-ui";
@Component({
	components: {
		Block,
	}
})
export default class Home extends Vue {
	data = {};
	block1: any = {};
	block2: any = null;
	index1: any = 0;
  index2: any = 0;
  temList: {data:any,activeId?:string}[] = [];
  activeId = "";
  mounted() {
    this.data = data.body;
    this.block1 = data.body;
    this.temList.push({
      data:data.body
    })
    this.index1 = 0;
  };
	
  getAfterItem(item,id){
    const index = item.items.findIndex(v=>v.id === id);
    if(index>-1 && item.items[index].items&& item.items[index].items.length){
      return  item.items[index]
    }
    return null;
  }
  itemLeftClick(){
    this.block2 = this.block1;
    this.index2 = this.index1;
    this.block1 = this.temList[this.index1-1].data;
    this.activeId = this.temList[this.index1-1].activeId as string;
    this.temList.splice(this.index2,1);
    this.index1 = this.index1-1; 

  }
  itemCloseClick(){
    this.block2 = null;
  }
  itemClick(data,i) {
    const {id,index} = data;
    // 切换下级
    if(i===1){
      const afterItem = this.getAfterItem(this.block1,id);
      if(afterItem){
        this.block2 = afterItem;
        this.index2 = index+1;
        if(!this.temList[this.index2]){this.temList[this.index2]={data:{}}};
        this.temList[this.index2].data = afterItem;
        this.temList[this.index1].activeId = id;
        this.activeId = id;
      }else{
        Message.warning("下级数据为空");
      }
    }else{
      const afterItem = this.getAfterItem(this.block2,id);
      if(afterItem){
        this.block1 = this.block2;
        this.index1 = this.index2;
        this.temList[this.index2].activeId = id;
        this.activeId = id;
        this.block2 = afterItem
        this.index2 = index+1;
        this.temList.push({
          data:afterItem
        })
      }else{
       Message.warning("下级数据为空");
      }
    }
    console.log(this.temList);
  }
}
</script>

<style lang="stylus"></style>
