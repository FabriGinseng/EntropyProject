<template>
  <el-container
    class="layout-container-demo"
    style="height: 100%; border: 1px solid #eee">
      <el-header style="text-align: right; padding-top: 8px;
      padding-bottom: 8px; background-color: #b3c0d1;">
          <img src="https://www.unimercatorum.it/app/templates/public/default/assets/images/logo.png" style="max-height: 100%; min-height: 100%"/>
      </el-header>
    <el-container>
      <el-aside width="70px">
        <el-scrollbar>
          <el-menu :collapse="true">
            <el-menu-item index="1" >
              <el-icon><icon-menu /></el-icon>
              <template #title>Map</template>
            </el-menu-item>
            <el-menu-item index="2" @click="Download">
              <el-icon><download /></el-icon>
              <template #title>Download map</template>
            </el-menu-item>
            <el-menu-item index="3" @click="Select">
              <el-icon><upload /></el-icon>
              <template #title>Upload map</template>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <Home
            :clickedUpload = "clickUp" :downloadAction = "downloadAction"/>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import {
  Message, Menu as IconMenu, Upload, Download, Setting, Delete,
} from '@element-plus/icons-vue';
import Home from '@/views/Home.vue';
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {
    Message, IconMenu, Upload, Download, Setting, Delete, Home,
  },
})
export default class Sidebar extends Vue {
clickUp = false;

  downloadAction=false;

  public Select():void{
    this.clickUp = !this.clickUp;
  }

  public Download():void{
    this.downloadAction = !this.downloadAction;
  }

  public CloseDialogEvent():void{
    this.clickUp = !this.clickUp;
  }
}
</script>

<style scoped>

.layout-container-demo .toolbar {
  position: absolute;
  display: inline-flex;
  align-items: center;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
}
</style>
