<template>
  <v-network-graph
    :nodes="nodes"
    :edges="edges"
    :configs="configs"
  />
</template>

<script>
import { Options } from 'vue-class-component';
import { defineComponent, reactive } from 'vue';

@Options({
  props: {
    nodes: Object,
    edges: Object,
  },
  components: {},
})
export default defineComponent({
  setup() {
    const configs = reactive({
      node: {
        normal: {
          color: '#4466cc88',
        },
      },
      edge: {
        selectable: true,
        normal: {
          width: 3,
          color: '#4466cc',
          dasharray: '0',
          linecap: 'butt',
          animate: false,
          animationSpeed: 50,
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
        type: 'straight',
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

    return { configs };
  },
});
</script>

<style scoped>

</style>
