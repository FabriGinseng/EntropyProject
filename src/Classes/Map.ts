interface Node{
  name:string;
  descrizione:string;
  link:Array<string>;
  pesoLink:number;
  entropia:number;
}

interface Edge {
  name:string;
  source:string;
  target:string;
}

export default class Map {
  nodes: Node[];

  edges: Edge[];

  constructor() {
    this.nodes = [];
    this.edges = [];
  }

  public creaNodi(nodeResponse:any):void {
    this.nodes.forEach((node) => {
      // eslint-disable-next-line no-param-reassign
      nodeResponse[node.name] = { name: node.descrizione };
    });
  }

  public creaLink(response:any):void {
    this.edges.forEach((edge) => {
      // eslint-disable-next-line no-param-reassign
      response[edge.name] = { source: edge.source, target: edge.target };
    });
  }

  public calcolaPesiNodo():void {
    const edges:any = [];
    this.edges.forEach((edge) => {
      if (edges[edge.source] === undefined) edges[edge.source] = [];
      edges[edge.source].push(edge.target);
    });
    this.nodes.forEach((node) => {
      // eslint-disable-next-line no-param-reassign
      node.link = edges[node.name];
      // eslint-disable-next-line no-param-reassign
      if (node.link !== undefined) node.pesoLink = 1 / node.link.length;
    });
    console.log(this.nodes);
  }

  public calcolaEntropiaNodoUscita():void {
    this.nodes.forEach((node) => {
      if (node.link !== undefined && node.link.length > 0) {
        const entropia = -1 * (node.link.length * (node.pesoLink * (Math.log2(node.pesoLink))));
        // eslint-disable-next-line no-param-reassign
        node.entropia = entropia;
      }
    });
  }

  public calcolaEntropiaNodoEntrata():void {
    this.nodes.forEach((node) => {
      const link:number[] = [];
      this.nodes.forEach((nodeEnter:Node) => {
        if (nodeEnter.link !== undefined && nodeEnter.link.length > 0) {
          // eslint-disable-next-line no-restricted-syntax
          for (const i of nodeEnter.link) {
            if (i === node.name) {
              link.push(nodeEnter.pesoLink * (Math.log2(nodeEnter.pesoLink)));
              // eslint-disable-next-line no-param-reassign
              break;
            }
          }
          // eslint-disable-next-line no-param-reassign,no-restricted-syntax
          for (const y of link) node.entropia += y;
          // eslint-disable-next-line no-param-reassign
          node.entropia *= -1;
        }
      });
    });
  }
}
