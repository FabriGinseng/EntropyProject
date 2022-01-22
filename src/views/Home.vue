<template>
  <el-main>
    <el-row>
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">

        <el-row>
          <el-card>
            <h2>AGGIUNGI NODI</h2>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="24">
              <el-form ref="formRef" label-position="top" label-width="150px">
                <el-form-item label="Nome nodo">
                  <el-input v-model="nomeNodo"></el-input>
                </el-form-item>
                <el-form-item label="Descrizione nodo">
                  <el-input v-model="descrizioneNodo" type="textarea"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click="AggiungiNodo()">Aggiungi</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-card>

        </el-row>
        <el-divider border-style="double"></el-divider>
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="24">
            <h2>Nodes</h2>
            <el-table :data="graph.nodes">
              <el-table-column label="Nome" prop="descrizione"/>
              <el-table-column label="Descrizione" prop="name"/>
            </el-table>
          </el-col>
        </el-row>
        <el-divider border-style="double"></el-divider>
        <el-row>
          <h2>AGGIUNGI ARCHI</h2>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="24">
            <el-form ref="formRef" label-position="left">
              <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="12">
              <el-form-item label="Start node">
                <el-select v-model="source"  placeholder="Select">
                  <el-option
                    v-for="item in graph.nodes"
                    :key="item.name"
                    :label="item.descrizione"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <el-form-item label="Target node">
                <el-select v-model="target" placeholder="Select">
                  <el-option
                    v-for="item in graph.nodes"
                    :key="item.name"
                    :label="item.descrizione"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              </el-col>
              <el-form-item>
                <el-button @click="AggiungiLink()">Aggiungi</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="24">
            <h2>Links</h2>
            <el-table :data="graph.edges">
              <el-table-column label="Source" prop="source"/>
              <el-table-column label="Target" prop="target"/>
            </el-table>
          </el-col>
        </el-row>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <v-network-graph
          :edges="edges"
          :nodes="nodi"
        />
      </el-col>
    </el-row>

  </el-main>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Map from '@/Classes/Map';
import { emptyProps } from 'element-plus';

@Options({
  props: {
    msg: String,
  },
  components: {},
})
export default class Home extends Vue {
  msg!: string;

  nomeNodo = '';

  descrizioneNodo = '';

  nodi = {};

  edges = {};

  source = '';

  target = '';

  countName = 0;

  public graph: Map = new Map();

  AggiungiLink():void {
    this.graph.edges.push(
      {
        // eslint-disable-next-line no-plusplus
        name: `Link ${this.countName++}`,
        source: this.source,
        target: this.target,
      },
    );
    this.graph.creaLink(this.edges);
    this.graph.calcolaPesiNodo();
  }

  AggiungiNodo():void {
    this.graph.nodes.push(
      {
        name: this.descrizioneNodo,
        descrizione: this.nomeNodo,
        link: [],
        pesoLink: 0,
      },
    );
    this.graph.creaNodi(this.nodi);
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
