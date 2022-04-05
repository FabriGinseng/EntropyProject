<template>
  <el-main>
    <h1>CONCEPT MAP {{graph.name}} by {{graph.author}}</h1>
    <el-row :gutter="10">
      <!-- COLUMN -->
      <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
        <el-row>
          <!-- ENTROPY -->
          <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
            <el-card header="H">
              <label>H(CM): {{ graph.totalEntropy }} </label>
              <el-divider></el-divider>
              <label>H(CM)/Hmax: {{ graph.totalEntropyPerc }} </label>
            </el-card>
          </el-col>
        </el-row>
        <el-divider border-style="double"/>
        <el-row>
          <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
            <!-- MAP -->
            <el-card header="CONCEPT MAP">
              <GraphComponent
                id="cardMap"
                :edges="edges"
                :nodes="nodes"
                style="height: 810px"/>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-main>
  <el-dialog v-model="openNodesMap" :destroy-on-close="true">
    <el-row>
      <!-- ADD NODE -->
      <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
        <el-card>
          <h2>ADD NODE</h2>
          <el-form ref="formNodes" :model="formNode" :rules="rules" label-position="top"
                   label-width="150px">
            <el-form-item label="Name" prop="nodeName">
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
      <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
        <el-card>
          <h2>NODES</h2>
          <el-table :data="graph.nodes">
            <el-table-column label="Name" prop="name"/>
            <el-table-column label="Description" prop="description"/>
            <el-table-column label="Operations">
              <template #default="scope">
                <el-button circle type="danger" @click="DeleteNode(scope.row)">
                  <el-icon>
                    <delete/>
                  </el-icon>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-divider border-style="double"></el-divider>
  </el-dialog>
  <el-dialog v-model="openEdgesMap" :before-close="NoCLoseMethodEdge"
             show-close="false" :destroy-on-close="true" width="70%">
    <el-row>
      <!-- ADD ARCS -->
      <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
        <el-card>
          <h2>ADD EDGES</h2>
          <el-form ref="formRef" :disabled="graph.nodes.length < 2" :inline="true"
                   label-position="left">
            <el-col :lg="12" :md="24" :sm="24" :xl="8" :xs="24">
              <el-form-item label="From node">
                <el-select v-model="source" placeholder="Select" @change="SelectSource">
                  <el-option
                    v-for="item in graph.nodes"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24"  :lg="12" :xl="8">
              <el-form-item label="To node">
                <el-select v-model="target" placeholder="Select">
                  <el-option
                    v-for="item in nodesLink"
                    :key="item.name"
                    :disabled="item.name === source"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="12" :md="24" :sm="24" :xl="8" :xs="24">
              <el-form-item label="Description">
                <el-input v-model="description" placeholder="add description"></el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="false" :lg="12" :md="24" :sm="24" :xl="8" :xs="24">
              <el-form-item label="Probability">
                <el-input-number :precision="2" :step="0.01" v-model="probability"
                                 :max="1" :min="0" ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :lg="12" :md="24" :sm="24" :xl="8" :xs="24">
              <el-form-item>
                <el-button :disabled="nodesLink.length === 0"
                           @click="AddLink()">ADD</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-divider border-style="double"></el-divider>
    <el-row>
      <!-- ARCS -->
      <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
        <el-card>
          <h2>EDGES</h2>
          <el-table :data="graph.edges" table-layout="auto">
            <el-table-column label="Source" prop="source"/>
            <el-table-column label="Target" prop="target"/>
            <el-table-column label="Description" prop="label">
              <template #default="scope">
                <label v-if="!scope.row.isEdit">{{scope.row.label}}</label>
                <el-input v-else v-model="description" placeholder="edit description"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="Probability" prop="probability">
              <template #default="scope">
                <label v-if="!scope.row.isEdit">{{scope.row.probability}}</label>
                <el-input-number v-else precision="2" :step="0.01"
                                 v-model="probability" size="small"
                          :max="1" :min="0"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column >
              <template #default="scope">
                <el-button v-if="!scope.row.isEdit" circle type="danger"
                           @click="DeleteLink(scope.row)">
                  <el-icon>
                    <delete/>
                  </el-icon>
                </el-button>
                <el-button v-if="!scope.row.isEdit" circle type="info" @click="EditLink(scope.row)">
                  <el-icon>
                    <edit-pen/>
                  </el-icon>
                </el-button>
                <el-button v-if="scope.row.isEdit" type="info"
                           @click="SaveEditLink(scope.row)">SAVE
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-col :lg="12" :md="24" :sm="24" :xl="8" :xs="24">
            <el-form-item>
              <el-button
                         @click="AddLinkConfirmed()">SAVE</el-button>
            </el-form-item>
          </el-col>
        </el-card>
      </el-col>
    </el-row>
  </el-dialog>
  <el-dialog v-model="clickedUpload" :destroy-on-close="true" :show-close="false"
             draggable>
    <el-row>
      <el-col :lg="24" :md="12" :sm="8" :xl="24" :xs="8">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :limit="1"
          :on-change="UploadFileMethod"
          :on-exceed="handleExceed"
          :on-remove="handleRemove"
          accept="application/json"
          class="upload-demo"
          drag>
          <el-icon class="el-icon--upload">
            <upload-filled/>
          </el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              only json files
            </div>
          </template>
        </el-upload>
      </el-col>
    </el-row>
  </el-dialog>

  <el-dialog v-model="visibleFileName" :destroy-on-close="true">
    <el-row>
      <el-col :lg="12" :md="12" :sm="8" :xl="12" :xs="8">
        <el-input v-model="nameMap" placeholder="Enter filename"/>
      </el-col>
      <el-col :lg="12" :md="12" :sm="8" :xl="12" :xs="8">
        <el-button type="info" @click="DownloadMethod">Download</el-button>
      </el-col>
    </el-row>
  </el-dialog>

  <el-dialog v-model="visibleFileNameImage" :destroy-on-close="true">
    <el-row>
      <el-col :lg="12" :md="12" :sm="8" :xl="12" :xs="8">
        <el-input v-model="nameMapImage" placeholder="Enter filename"/>
      </el-col>
      <el-col :lg="12" :md="12" :sm="8" :xl="12" :xs="8">
        <el-button type="info" @click="DownloadImageMapMethod">Download</el-button>
      </el-col>
    </el-row>
  </el-dialog>

  <el-dialog v-model="visibleAddForm" width="30%"
             :before-close="NoCLoseMethod" :show-close="false">
    <el-tabs type="border-card">
      <el-tab-pane label="Add map detail">
        <el-row :gutter="10">
          <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
            <el-form ref="formMapRef" label-position="top" :model="graph" :rules="rulesFormMap"
                     label-width="150px">
              <el-row>
                <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
                  <el-form-item label="Map name" prop="name">
                    <el-input v-model="graph.name"
                              placeholder="enter name"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
                  <el-form-item label="Author" prop="author">
                    <el-input v-model="graph.author"
                              placeholder="add description"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
                  <el-form-item label="Data">
                    <el-date-picker disabled v-model="graph.date"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
                  <el-form-item label="Description">
                    <el-input v-model="graph.description" placeholder="add description"
                              type="textarea"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="Upload">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :limit="1"
          :on-change="UploadFileMethod"
          :on-exceed="handleExceed"
          :on-remove="handleRemove"
          accept="application/json"
          class="upload-demo"
          drag>
          <el-icon class="el-icon--upload">
            <upload-filled/>
          </el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              only json files
            </div>
          </template>
        </el-upload>
      </el-tab-pane>
    </el-tabs>
    <el-row justify="end" style="padding: 10px;">
      <el-col :lg="12" :md="12" :sm="12" :xl="4" :xs="24">
        <el-form-item>
          <el-button type="danger" @click="CloseDialogForm">Close</el-button>
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xl="4" :xs="24">
        <el-form-item>
          <el-button type="success" @click="AddFormMap">Create</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Map, { Edge, Node } from '@/Classes/Map';
import GraphComponent from '@/components/GraphComponent.vue';
import { ElMessage } from 'element-plus';
import { Delete, UploadFilled, EditPen } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { UploadFile } from 'element-plus/es/components/upload/src/upload.type';
import html2canvas from 'html2canvas';

const upload = ref();
@Options({
  components: {
    GraphComponent,
    Delete,
    EditPen,
    UploadFilled,
  },
})
export default class Home extends Vue {
  probability = 0

  visibleFileName = false;

  visibleFileNameImage = false;

  visibleAddForm = true;

  nameMapImage = '';

  nameMap = '';

  formNode = {
    nodeName: '',
    nodeDescription: '',
  };

  x = 0;

  i = 0;

  nodes: { [index: string]: any } = {};

  nodesLink = {};

  edges: { [index: string]: any } = {};

  source = '';

  target = '';

  countName = 0;

  description = '';

  dialogUploadVisible = true;

  @Prop() readonly clickedUpload: boolean | undefined;

  @Prop() readonly downloadAction: boolean | undefined;

  @Prop() readonly downloadImageAction: boolean | undefined;

  @Prop() readonly openFormMap: boolean | undefined;

  @Prop() openEdgesMap: boolean | undefined;

  @Prop() readonly openNodesMap: boolean | undefined;

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
  };

  public rulesFormMap = {
    name: [
      {
        required: true,
        message: 'Campo obbligatorio',
        trigger: 'blur',
      },
    ],
    author: [
      {
        required: true,
        message: 'Campo obbligatorio',
        trigger: 'blur',
      },
    ],
  };

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,class-methods-use-this
  sleep() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }

  NoCLoseMethod() {
    this.visibleAddForm = true;
  }

  NoCLoseMethodEdge() {
    this.openEdgesMap = true;
  }

  handleRemove = async (file: UploadFile, fileList: FileList[]) => {
    fileList.pop();
  };

  UploadFileMethod = async (file: UploadFile, fileList: FileList[]) => {
    try {
      const reader = new FileReader();
      let result: any = null;
      reader.onload = (event) => {
        result = event.target;
      };
      reader.readAsText(file.raw);
      await this.sleep();
      if (typeof reader.result === 'string') {
        const response = JSON.parse(reader.result);
        this.graph = new Map();
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const nodesKey in this.nodes) {
          delete this.nodes[nodesKey];
        }
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const edgesKey in this.edges) {
          delete this.edges[edgesKey];
        }
        this.graph.name = response.name;
        this.graph.author = response.author;
        this.graph.date = response.date;
        this.graph.description = response.description;
        this.graph.nodes = response.nodes;
        this.graph.edges = response.edges;
        this.graph.CreateNodes(this.nodes);
        this.graph.CreateEdges(this.edges);
        this.graph.CalculateWeight(this.edges);
        this.graph.CalculateEntropy();
        this.graph.CalculateEntropyEdges(this.edges);
        this.countName = 0;
        this.countName = this.graph.edges.length;
        this.CloseDialog();
        this.handleRemove(file, fileList);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  // eslint-disable-next-line class-methods-use-this
  DeleteLink(selectedEdge: Edge): void {
    for (let i = 0; i < this.graph.edges.length; i += 1) {
      if (this.graph.edges[i] === selectedEdge) {
        this.graph.edges.splice(i, 1);
        delete this.edges[selectedEdge.name];
        this.graph.CalculateWeight(this.edges);
        this.graph.CalculateEntropy();
        this.graph.CalculateEntropyEdges(this.edges);
        break;
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  EditLink(selectedEdge: Edge): void {
    // eslint-disable-next-line no-restricted-syntax
    for (const j of this.graph.edges) {
      if (j.isEdit) {
        ElMessage('You can edit only one row');
        return;
      }
    }
    this.probability = selectedEdge.probability;
    this.description = selectedEdge.label;
    // eslint-disable-next-line no-param-reassign
    selectedEdge.isEdit = true;
  }

  SaveEditLink(selectedEdge: Edge): void {
    // eslint-disable-next-line no-param-reassign
    selectedEdge.probability = this.probability;
    // eslint-disable-next-line no-param-reassign
    selectedEdge.label = this.description;
    for (let i = 0; i < this.graph.edges.length; i += 1) {
      if (this.graph.edges[i] === selectedEdge) {
        this.graph.CalculateProbabilitySum(this.edges);
        this.graph.CalculateEntropy();
        this.graph.CalculateEntropyEdges(this.edges);
        break;
      }
    }
    this.probability = 0;
    this.description = '';
    // eslint-disable-next-line no-param-reassign
    selectedEdge.isEdit = false;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  handleExceed = (files: FileList, fileList: UploadFile[]) => {
    ElMessage.warning(
      `The limit is 1, you selected ${files.length} files this time, add up to ${
        files.length + fileList.length
      } totally`,
    );
  };

  // eslint-disable-next-line class-methods-use-this
  DownloadImageMapMethod() {
    const cardMap = document.getElementById('cardMap');
    if (cardMap !== null) {
      html2canvas(cardMap)
        .then(
          (canvas) => {
            const link = document.createElement('a');
            link.download = `${this.nameMapImage}.png`;
            link.href = canvas.toDataURL();
            link.click();
          },
        );
    }
  }

  DownloadMethod() {
    if (this.graph.nodes.length > 0) {
      const data = JSON.stringify(this.graph);
      localStorage.setItem('file', data);
      const blob = new Blob([data], { type: 'text/plain' });
      const e = document.createEvent('MouseEvents');
      const a = document.createElement('a');
      a.download = `${this.nameMap}.json`;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = [`${this.nameMap}.json`, a.download, a.href].join(':');
      e.initEvent('click', true, false);
      a.dispatchEvent(e);
    } else {
      ElMessage.error('Please, enter at least one node');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  DeleteNode(selectedNode: Node): void {
    if ((selectedNode.links !== undefined && selectedNode.links.length > 0)
      || this.graph.CheckNodesDelete(selectedNode)) {
      ElMessage.error('The node is connected to other nodes, remove all links first');
      return;
    }
    for (let i = 0; i < this.graph.nodes.length; i += 1) {
      if (this.graph.nodes[i] === selectedNode) {
        this.graph.nodes.splice(i, 1);
        delete this.nodes[selectedNode.name];
      }
    }
  }

  AddLink(): void {
    try {
      if (this.target) {
        this.graph.edges.push(
          {
            // eslint-disable-next-line no-plusplus
            name: `Link ${this.countName++}`,
            source: this.source,
            target: this.target,
            label: this.description,
            weight: 0,
            probability: this.probability,
            isEdit: false,
          },
        );
        this.graph.CreateEdges(this.edges);
        this.graph.CalculateProbabilitySum(this.edges);
        this.graph.CalculateEntropy();
        this.graph.CalculateEntropyEdges(this.edges);
        this.target = '';
        // eslint-disable-next-line no-restricted-syntax
        for (const i of this.graph.nodes) {
          if (i.name === this.source) {
            this.nodesLink = this.graph.CheckCycle(i);
          }
        }
        this.source = '';
        this.description = '';
        this.probability = 0;
      } else ElMessage.error('Probability required');
    } catch (erro:any) {
      console.log(erro);
    }
  }

  AddLinkConfirmed():void {
    if (this.graph.VerifyProbability()) this.$emit('closeDialogEdge');
    else ElMessage.error('Probability not corrected');
  }

  AddFormMap():void {
    const formMapRef = this.$refs.formMapRef as any;
    formMapRef.validate(async (valid: boolean) => {
      if (valid) {
        this.visibleAddForm = false;
      }
    });
  }

  CloseDialogForm():void{
    const formMapRef = this.$refs.formMapRef as any;
    formMapRef.validate(async (valid: boolean) => {
      if (valid) {
        this.visibleAddForm = false;
      }
    });
  }

  AddNode(): void {
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
              size: 32,
              links: [],
              linkWeight: 0,
              entropy: 0,
            },
          );
          this.graph.CreateNodes(this.nodes);
          this.formNode.nodeDescription = '';
          this.formNode.nodeName = '';
        } else {
          ElMessage.error('Nodo giá presente');
        }
      }
    });
  }

  CheckDuplicate(): boolean {
    let flag = false;
    this.graph.nodes.forEach((node) => {
      if (node.name === this.formNode.nodeName) flag = true;
    });
    return flag;
  }

  SelectSource(): void {
  // eslint-disable-next-line no-restricted-syntax
    for (const i of this.graph.nodes) {
      if (i.name === this.source) {
        this.nodesLink = this.graph.CheckCycle(i);
      }
    }
  }

  @Watch('downloadAction')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  WatchDownloadAction(newVal: boolean) {
    if (newVal) this.visibleFileName = true;
  }

  @Watch('downloadImageAction')
  WatchDownloadImageAction(newVal: boolean) {
    if (newVal) this.visibleFileNameImage = true;
  }

  @Watch('openFormMap')
  WatchCreateFormMap(newVal: boolean) {
    if (newVal) this.visibleAddForm = true;
  }

  @Emit()
  CloseDialog() {
    this.$emit('CloseDialog');
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
