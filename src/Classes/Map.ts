interface Node{
  name:string;
  descrizione:string;
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
}
