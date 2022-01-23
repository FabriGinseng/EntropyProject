<template>
  <el-main>
    <el-row>
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <el-row>
          <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
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
        </el-row>
        <el-divider border-style="double"></el-divider>
        <el-row>
          <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
            <h2>Nodes</h2>
            <el-table :data="graph.nodes">
              <el-table-column label="Nome" prop="descrizione"/>
              <el-table-column label="Descrizione" prop="name"/>
            </el-table>
          </el-col>
        </el-row>
        <el-divider border-style="double"></el-divider>
        <el-row>
          <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
            <el-form ref="formRef" label-position="top" label-width="150px">
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
              <el-divider border-style="double"></el-divider>
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
              <el-form-item>
                <el-button @click="AggiungiLink()">Aggiungi</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
            <h2>Links</h2>
            <el-table :data="graph.edges">
              <el-table-column label="Source" prop="source"/>
              <el-table-column label="Target" prop="target"/>
            </el-table>
          </el-col>
        </el-row>
      </el-col>
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <v-network-graph
          :edges="edges"
          :nodes="nodi"
          :configs="configs"
        />
      </el-col>
    </el-row>

  </el-main>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Map from '@/Classes/Map';
import { emptyProps } from 'element-plus';
import { reactive } from 'vue';

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

  nodi: any = {};

  edges: any = {};

  source = '';

  target = '';

  countName = 0;

  configs = reactive({
    edge: {
      marker: {
        source: {
          type: 'none',
          width: 4,
          height: 4,
          margin: -1,
          units: 'strokeWidth',
          color: null,
        },
        target: {
          type: 'arrow',
          width: 4,
          height: 4,
          margin: -1,
          units: 'strokeWidth',
          color: null,
        },
      },
    },
  });

  public graph: Map = new Map();

  AggiungiLink() {
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
    this.graph.calcolaEntropiaNodoEntrata();
    console.log(this.graph);
  }

  AggiungiNodo() {
    this.graph.nodes.push(
      {
        name: this.descrizioneNodo,
        descrizione: this.nomeNodo,
        link: [],
        pesoLink: 0,
        entropia: 0,
      },
    );
    this.graph.creaNodi(this.nodi);
  }

  // eslint-disable-next-line class-methods-use-this
  onSubmit() {
    console.log('submit!');
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
