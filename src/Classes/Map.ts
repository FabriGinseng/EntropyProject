interface Node{
  name:string;
  descrizione:string;
  link:Array<string>;
  pesoLink:number;
  entropia:number;
  x: number;
  y: number;
}

interface Edge {
  name:string;
  source:string;
  target:string;
  label:string
  peso:number
}

export default class Map {
  nodes: Node[];

  edges: Edge[];

  entropia: number;

  constructor() {
    this.nodes = [];
    this.edges = [];
    this.entropia = 0;
  }

  public creaNodi(nodeResponse:any):void {
    this.nodes.forEach((node) => {
      // eslint-disable-next-line no-param-reassign
      nodeResponse[node.name] = { name: node.descrizione, x: node.x, y: node.y };
    });
  }

  public creaLink(response:any):void {
    this.edges.forEach((edge) => {
      // eslint-disable-next-line no-param-reassign
      response[edge.name] = {
        source: edge.source, target: edge.target, label: edge.label + edge.peso, peso: 0,
      };
    });
  }

  public calcolaPesiNodo(response:any):void {
    // eslint-disable-next-line no-underscore-dangle
    const _edges:any = [];
    this.edges.forEach((edge) => {
      if (_edges[edge.source] === undefined) _edges[edge.source] = [];
      _edges[edge.source].push(edge.target);
    });
    this.nodes.forEach((node) => {
      // eslint-disable-next-line no-param-reassign
      node.link = _edges[node.name];
      // eslint-disable-next-line no-param-reassign
      if (node.link !== undefined) node.pesoLink = 1 / node.link.length;
      this.edges.forEach((edge) => {
        // eslint-disable-next-line no-param-reassign
        if (edge.source === node.name) {
          // eslint-disable-next-line no-param-reassign
          edge.peso = node.pesoLink;
        }
        // eslint-disable-next-line no-param-reassign
        response[edge.name] = {
          source: edge.source, target: edge.target, label: `${edge.label} ${edge.peso}`, peso: edge.peso,
        };
      });
    });
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
          node.entropia = 0;
          // eslint-disable-next-line no-param-reassign,no-restricted-syntax
          for (const y of link) node.entropia += y;
          // eslint-disable-next-line no-param-reassign
          node.entropia *= -1;
        }
      });
    });
  }

  public entropiaGrafo():number {
    this.entropia = 0;
    this.nodes.forEach((node) => {
      this.entropia += node.entropia;
    });
    return this.entropia;
  }
}
