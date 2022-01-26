<template>
  <el-main>
    <h1>CREATE YOUR MIND MAP</h1>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="24">
          <el-card>
            <h2>ADD NODES</h2>
            <el-form ref="formNodes" :model="formNode" label-position="top"  label-width="150px">
                <el-form-item label="Name" prop="nodeName"  required>
                  <el-input v-model="formNode.nodeName"></el-input>
                </el-form-item>
                <el-form-item label="Description" prop="nodeDescription" required>
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
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="24">
          <el-card>
              <h2>NODES</h2>
              <el-table :data="graph.nodes">
                <el-table-column label="Name" prop="name"/>
                <el-table-column label="Description" prop="description"/>
                <!--<el-table-column label="Entropia" prop="entropy"/>-->
              </el-table>
          </el-card>
          </el-col>
        </el-row>
        <el-divider border-style="double"></el-divider>
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="24">
          <el-card>
            <h2>ADD LINKS</h2>
            <el-form ref="formRef" label-position="left" :inline="true"
                     :disabled="graph.nodes.length < 2">
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
                  <el-form-item label="Start node">
                    <el-select v-model="source" @change="SelectSource"  placeholder="Select">
                      <el-option
                        v-for="item in graph.nodes"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
                  <el-form-item label="Target node">
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
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
              <el-form-item>
                  <el-button @click="AddLink()">ADD</el-button>
                </el-form-item>
              </el-col>
              </el-form>
          </el-card>
          </el-col>
        </el-row>
        <el-divider border-style="double"></el-divider>
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="24">
          <el-card>
              <h2>Links</h2>
              <el-table :data="graph.edges">
                <el-table-column label="Source" prop="source"/>
                <el-table-column label="Target" prop="target"/>
              </el-table>
          </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="24">
            <el-card header="ENTROPY">
              <label>ENTROPIA TOTALE: {{ graph.totalEntropy }} </label>
            </el-card>
          </el-col>
        </el-row>
        <el-divider border-style="double"/>
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="24">
            <el-space wrap>
            <el-card header="MIND MAP">
              <GraphComponent
                style="height: 810px"
                :edges="edges"
                :nodes="nodes"/>
            </el-card>
            </el-space>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-main>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Map from '@/Classes/Map';
import GraphComponent from '@/components/GraphComponent.vue';

@Options({
  components: { GraphComponent },
})
export default class Home extends Vue {
  formNode = {
    nodeName: '',
    nodeDescription: '',
  }

  x = 0;

  i = 0;

  nodes = {};

  nodesLink = {};

  edges = {};

  source = '';

  target = '';

  countName = 0;

  public graph: Map = new Map();

  AddLink():void {
    this.graph.edges.push(
      {
        // eslint-disable-next-line no-plusplus
        name: `Link ${this.countName++}`,
        source: this.source,
        target: this.target,
        label: 'weight',
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
  }

  AddNode():void {
    const formRef = this.$refs.formNodes as any;

    formRef.validate(async (valid: boolean) => {
      if (valid) {
        const Y = this.x + 50;
        this.x += 50;
        this.i += 1;
        this.graph.nodes.push(
          {
            name: this.formNode.nodeName,
            description: this.formNode.nodeDescription,
            index: this.i,
            links: [],
            linkWeight: 0,
            entropy: 0,
            x: this.x,
            y: Y,
          },
        );
        this.graph.CreateNodes(this.nodes);
        this.formNode.nodeDescription = '';
        this.formNode.nodeName = '';
      }
    });
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
