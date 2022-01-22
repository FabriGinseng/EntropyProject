interface Node{
  name:string;
  descrizione:string;
  link:Array<string>;
  pesoLink:number;
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
}
