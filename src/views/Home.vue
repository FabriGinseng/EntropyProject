<template>
  <el-main>
    <h1>CREATE YOUR MIND MAP</h1>
    <el-row>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="24">
          <el-card>
            <h2>ADD NODES</h2>
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
          </el-card>
          </el-col>
        </el-row>
        <el-divider border-style="double"></el-divider>
        <el-row>

          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="24">
          <el-card>
              <h2>NODES</h2>
              <el-table :data="graph.nodes">
                <el-table-column label="Nome" prop="descrizione"/>
                <el-table-column label="Descrizione" prop="name"/>
                <el-table-column label="Entropia" prop="entropia"/>
              </el-table>
          </el-card>
          </el-col>
        </el-row>
        <el-divider border-style="double"></el-divider>
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="24">
          <el-card>
            <h2>ADD LINKS</h2>

            <el-form ref="formRef" label-position="left" :inline="true">
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
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
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
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
              <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="8">
              <el-form-item>
                  <el-button @click="AggiungiLink()">Aggiungi</el-button>
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
              <label>IL GRAFO HA UN' ENTROPIA TOTALE: {{entropia}} </label>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="24">
            <el-card header="MIND MAP">
              <GraphComponent
                style="height: 860px"
                :edges="edges"
                :nodes="nodes"/>
            </el-card>
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
  props: {
    msg: String,
  },
  components: { GraphComponent },
})
export default class Home extends Vue {
  entropia = 0;

  msg!: string;

  nomeNodo = '';

  descrizioneNodo = '';

  x = 0;

  nodes:any = {};

  edges:any = {};

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
        label: 'peso',
        peso: 0,
      },
    );
    this.graph.creaLink(this.edges);
    this.graph.calcolaPesiNodo(this.edges);
    this.graph.calcolaEntropiaNodoEntrata();
    this.entropia = this.graph.entropiaGrafo();
  }

  AggiungiNodo():void {
    const Y = this.x + 50;
    // eslint-disable-next-line prefer-const
    this.x += 50;
    this.graph.nodes.push(
      {
        name: this.descrizioneNodo,
        descrizione: this.nomeNodo,
        link: [],
        pesoLink: 0,
        entropia: 0,
        x: this.x,
        y: Y,
      },
    );
    this.graph.creaNodi(this.nodes);
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
