<template>
	<div style="width: 400px; border: 1px solid red">
		<div>
			<i @click="onLeftClick" v-if="left && index !== 0" class="el-icon-arrow-left"></i> {{ data.name }}
			<i v-if="right" @click="onCloseClick" class="el-icon-close"></i>
		</div>
		<div v-for="item in data.items" :key="item.id">
			<span @click="toItem({id:item.id,index:index})" :style="{color:activeId===item.id?'red':''}">{{ item.name }} {{item.id}}</span>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { data } from "./data";

@Component({
	components: {},
})
export default class Home extends Vue {
	@Prop({
		default: () => [],
	})
  data;
  @Prop({
    default: 0
  })
  index;
	@Prop({
		default: false,
	})
	left;
	@Prop({
		default: false,
	})
	right;
	@Prop()
	activeId
	@Emit()
  onToItem(id) {}
  
  @Emit()
  onLeftClick(){}

  @Emit()
  onCloseClick(){};
  
	toItem(id) {
		this.onToItem(id);
	}
	mounted() {
		console.log(this.data);
	}
}
</script>

<style lang="stylus"></style>
