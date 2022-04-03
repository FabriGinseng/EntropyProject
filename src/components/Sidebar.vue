<template>
  <el-container
    class="layout-container-demo"
    style="height: 100%; border: 1px solid #eee">
      <el-header style="text-align: right; padding-top: 8px;
      padding-bottom: 8px; background-color: #b3c0d1;">
          <img src="https://www.unimercatorum.it/app/templates/public/default/assets/images/logo.png" style="max-height: 100%; min-height: 100%"/>
      </el-header>
    <el-container>
          <el-menu :collapse="true"
                   default-active="1">
            <el-menu-item index="1" >
              <el-icon><icon-menu /></el-icon>
              <template #title>Map</template>
            </el-menu-item>
            <el-menu-item index="2" @click="AddFormMap">
              <el-icon><edit-pen /></el-icon>
              <template #title>details Map</template>
            </el-menu-item>
            <el-sub-menu index="3" >
              <template #title>
                <el-icon><plus /></el-icon>
                <span>Add</span>
                </template>
              <el-menu-item-group>
                <el-menu-item index="3-1" @click="AddNode">Add Node</el-menu-item>
                <el-menu-item index="3-2"
                              @click="AddEdge">Add Edge</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="4" >
              <template #title>
                <el-icon><download /></el-icon>
                <span>Download</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="4-1" @click="Download">Download json map file</el-menu-item>
                <el-menu-item index="4-2"
                              @click="DownloadImageMap">Download image map file</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-menu-item index="5" @click="Select">
              <el-icon><upload /></el-icon>
              <template #title>upload map</template>
            </el-menu-item>
          </el-menu>
      <Home
        @CloseDialog="CloseDialogEvent"
            :clickedUpload = "clickUp" :downloadImageAction = "downloadImageAction"
            :openEdgesMap = "visibleEdge" :openNodesMap = "visibleNode"
            :downloadAction = "downloadAction" :openFormMap="visibleForm"/>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import {
  Message, Menu as IconMenu, Upload, Download, Setting, Delete, EditPen, Plus,
} from '@element-plus/icons-vue';
import Home from '@/views/Home.vue';
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {
    Message, IconMenu, Upload, Download, Setting, Delete, Home, EditPen, Plus,
  },
})
export default class Sidebar extends Vue {
  clickUp = false;

  visibleForm = false;

  visibleNode = false;

  visibleEdge = false;

  downloadAction=false;

  downloadImageAction=false;

  public Select():void{
    this.clickUp = !this.clickUp;
  }

  public AddFormMap():void{
    this.visibleForm = !this.visibleForm;
  }

  public AddNode():void{
    this.visibleNode = !this.visibleNode;
  }

  public AddEdge():void{
    this.visibleEdge = !this.visibleEdge;
  }

  public Download():void{
    this.downloadAction = !this.downloadAction;
  }

  public DownloadImageMap():void{
    this.downloadImageAction = !this.downloadImageAction;
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
