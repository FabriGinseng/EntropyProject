<template>
  <el-main>
    <h1>CREATE YOUR CONCEPTUAL MAP</h1>
    <el-row :gutter="10">
      <!-- FIRST COLUMN -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-row>
          <!-- ADD NODE -->
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-card>
            <h2>ADD NODE</h2>
            <el-form ref="formNodes" :model="formNode" :rules="rules" label-position="top"
                     label-width="150px">
                <el-form-item label="Name" prop="nodeName" >
                  <el-input v-model="formNode.nodeName"></el-input>
                </el-form-item>
                <el-form-item label="Description" prop="nodeDescription">
                  <el-input v-model="formNode.nodeDescription" type="textarea"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click="AddNode()">ADD</el-button>
                </el-form-item>
              </el-form>
          </el-card>
          </el-col>
        </el-row>
        <el-divider border-style="double"></el-divider>
        <!-- NODES -->
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-card>
              <h2>NODES</h2>
              <el-table :data="graph.nodes">
                <el-table-column label="Name" prop="name"/>
                <el-table-column label="Description" prop="description"/>
                <el-table-column label="Operations">
                  <template #default="scope">
                    <el-button type="danger" @click="DeleteNode(scope.row)" circle>
                      <el-icon><delete /></el-icon>
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
          </el-card>
          </el-col>
        </el-row>
        <el-divider border-style="double"></el-divider>
        <el-row>
          <!-- ADD ARCS -->
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-card>
            <h2>ADD ARCS</h2>
            <el-form ref="formRef" label-position="left" :inline="true"
                     :disabled="graph.nodes.length < 2">
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="6">
                  <el-form-item label="From node">
                    <el-select v-model="source" @change="SelectSource"  placeholder="Select">
                      <el-option
                        v-for="item in graph.nodes"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="6">
                  <el-form-item label="To node">
                    <el-select v-model="target" placeholder="Select">
                      <el-option
                        v-for="item in nodesLink"
                        :disabled="item.name === source"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="6">
                <el-form-item label="Description">
                  <el-input v-model="description" placeholder="add description"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="6">
              <el-form-item>
                  <el-button :disabled="nodesLink.length === 0" @click="AddLink()">ADD</el-button>
                </el-form-item>
              </el-col>
              </el-form>
          </el-card>
          </el-col>
        </el-row>
        <el-divider border-style="double"></el-divider>
        <el-row>
          <!-- ARCS -->
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-card>
              <h2>ARCS</h2>
              <el-table :data="graph.edges">
                <el-table-column label="Source" prop="source"/>
                <el-table-column label="Target" prop="target"/>
                <el-table-column label="Operations">
                  <template #default="scope">
                    <el-button type="danger" @click="DeleteLink(scope.row)" circle>
                      <el-icon><delete /></el-icon>
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
          </el-card>
          </el-col>
        </el-row>
      </el-col>

      <!-- SECOND COLUMN -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-row>
          <!-- ENTROPY -->
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-card header="ENTROPY">
              <label>TOTAL: {{ graph.totalEntropy }} </label>
              <el-divider></el-divider>
              <label>PERCENTAGE: {{ graph.totalEntropyPerc }} </label>
            </el-card>
          </el-col>
        </el-row>
        <el-divider border-style="double"/>
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <!-- MAP -->
            <el-card header="MIND MAP">
              <GraphComponent
                style="height: 810px"
                :edges="edges"
                :nodes="nodes"/>
            </el-card>
          </el-col>
        </el-row>
        <el-button @click="DownloadMethod()">DOWNLOAD</el-button>
      </el-col>
    </el-row>
  </el-main>
  <el-dialog v-model="clickedUpload">
    <el-row>
      <el-upload
        ref="upload"
        class="upload-demo"
        :on-preview="handleFilePreview"
        drag
        :limit="1"
        :on-exceed="handleExceed"
        :auto-upload="false">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            only json files
          </div>
        </template>
      </el-upload>
      <el-button class="ml-3" type="success" @click="submitUpload"
      >upload to server</el-button
      >

    </el-row>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Map, { Edge, Node } from '@/Classes/Map';
import GraphComponent from '@/components/GraphComponent.vue';
import { ElMessage } from 'element-plus';
import { Delete, UploadFilled } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { Prop } from 'vue-property-decorator';
import { UploadFile } from 'element-plus/es/components/upload/src/upload.type';

const upload = ref();
@Options({
  components: { GraphComponent, Delete, UploadFilled },
})
export default class Home extends Vue {
  formNode = {
    nodeName: '',
    nodeDescription: '',
  }

  x = 0;

  i = 0;

  nodes : {[index:string]:any} = {};

  nodesLink = {};

  edges : {[index:string]:any} = {};

  source = '';

  target = '';

  countName = 0;

  description = '';

  dialogUploadVisible = true;

  @Prop() readonly clickedUpload: boolean | undefined

  public graph: Map = new Map();

  public rules = {
    nodeName: [
      {
        required: true,
        message: 'Campo obbligatorio',
        trigger: 'blur',
      },
    ],
    nodeDescription: [
      {
        required: true,
        message: 'Campo obbligatorio',
        trigger: 'blur',
      },
    ],
  }

  // eslint-disable-next-line class-methods-use-this
  DeleteLink(selectedEdge: Edge):void {
    for (let i = 0; i < this.graph.edges.length; i += 1) {
      if (this.graph.edges[i] === selectedEdge) {
        this.graph.edges.splice(i, 1);
        delete this.edges[selectedEdge.name];
        this.graph.CalculateWeight(this.edges);
        this.graph.CalculateEntropy();
        break;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  submitUpload = () => {
    console.log(upload);
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  handleExceed = (files: FileList, fileList: UploadFile[]) => {
    ElMessage.warning(
      `The limit is 1, you selected ${files.length} files this time, add up to ${
        files.length + fileList.length
      } totally`,
    );
  };
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  handleFilePreview = (file: UploadFile) => {
    console.log('entro?');
    console.log(file);
  };

  DownloadMethod() {
    const data = JSON.stringify(this.graph);
    localStorage.setItem('file', data);
    const blob = new Blob([data], { type: 'text/plain' });
    const e = document.createEvent('MouseEvents');
    const a = document.createElement('a');
    a.download = 'test.json';
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
    e.initEvent('click', true, false);
    a.dispatchEvent(e);
  }

  // eslint-disable-next-line class-methods-use-this
  DeleteNode(selectedNode: Node):void{
    if ((selectedNode.links !== undefined && selectedNode.links.length > 0)
      || this.graph.CheckNodesDelete(selectedNode)) {
      ElMessage.error('Il nodo ha è collegato ad altri nodi, rimuovere prima tutti i collegamenti');
      return;
    }
    for (let i = 0; i < this.graph.nodes.length; i += 1) {
      if (this.graph.nodes[i] === selectedNode) {
        this.graph.nodes.splice(i, 1);
        delete this.nodes[selectedNode.name];
      }
    }
  }

  AddLink():void {
    if (this.target) {
      this.graph.edges.push(
        {
          // eslint-disable-next-line no-plusplus
          name: `Link ${this.countName++}`,
          source: this.source,
          target: this.target,
          label: this.description,
          weight: 0,
        },
      );
      this.graph.CreateLinks(this.edges);
      this.graph.CalculateWeight(this.edges);
      this.graph.CalculateEntropy();
      this.target = '';
      // eslint-disable-next-line no-restricted-syntax
      for (const i of this.graph.nodes) {
        if (i.name === this.source) {
          this.nodesLink = this.graph.CheckCycle(i);
        }
      }
      this.source = '';
    }
  }

  AddNode():void {
    const formRef = this.$refs.formNodes as any;
    formRef.validate(async (valid: boolean) => {
      if (valid) {
        this.i += 1;
        if (!this.CheckDuplicate()) {
          this.graph.nodes.push(
            {
              name: this.formNode.nodeName,
              description: this.formNode.nodeDescription,
              index: this.i,
              links: [],
              linkWeight: 0,
              entropy: 0,
            },
          );
          this.graph.CreateNodes(this.nodes);
          this.formNode.nodeDescription = '';
          this.formNode.nodeName = '';
        } else ElMessage.error('Nodo giá presente');
      }
    });
  }

  CheckDuplicate():boolean {
    let flag = false;
    this.graph.nodes.forEach((node) => {
      if (node.name === this.formNode.nodeName) flag = true;
    });
    return flag;
  }

  SelectSource():void {
    // eslint-disable-next-line no-restricted-syntax
    for (const i of this.graph.nodes) {
      if (i.name === this.source) {
        this.nodesLink = this.graph.CheckCycle(i);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
