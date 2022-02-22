<template>
  <v-network-graph
    :nodes="nodes"
    :edges="edges"
    :configs="configs"
  >
    <template
      #override-node-label="{
        scale, text
      }"
    >
      <text
        x="0"
        y="0"
        :font-size="15 * scale"
        text-anchor="middle"
        dominant-baseline="central"
        fill="#000000"
      >{{ text }}</text
      >
    </template>
  <template #edge-label="{ edge, ...slotProps }">
    <v-edge-label
      :text="edge.label"
      style="text-wrap: normal"
      align="center"
      :vertical-align="verticalAlign"
      v-bind="slotProps"
    />
  </template>
  </v-network-graph>
</template>

<script>
import { Options, Vue } from 'vue-class-component';
import { reactive, ref } from 'vue';

@Options({
  props: {
    nodes: Object,
    edges: Object,
  },
  components: {},
})
export default class Home extends Vue {
   verticalAlign = ref('above');

    configs = reactive({
      node: {
        normal: {
          type: 'circle',
          radius: (node) => node.size, // Use the value of each node object
          color: (node) => node.color,
          strokeWidth: 1,
          strokeColor: '#000000',
        },
        hover: {
          color: '#f0f0f0',
        },
        label: {
          fontSize: 12,
          color: '#000000',
          direction: 'center',
        },
      },
      edge: {
        label: {
          fontFamily: undefined,
          fontSize: 11,
          lineHeight: 1.1,
          color: '#000000',
          margin: 4,
          background: {
            visible: true,
            color: '#ffffff',
            padding: {
              vertical: 1,
              horizontal: 4,
            },
            borderRadius: 2,
          },
        },
        hover: {
          width: 4,
          color: '#3355bb',
          dasharray: '0',
          linecap: 'butt',
          animate: false,
          animationSpeed: 50,
        },
        selected: {
          width: 3,
          color: '#dd8800',
          dasharray: '6',
          linecap: 'round',
          animate: false,
          animationSpeed: 50,
        },
        gap: 5,
        type: 'curve',
        margin: 2,
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
}
</script>

<style scoped>

</style>
