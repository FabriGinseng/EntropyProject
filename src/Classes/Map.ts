/**
 * This interface describes the nodes in the graph
 * @interface Node
 * @member name The node name
 * @
 */
interface Node{
  name:string;
  description:string;
  link:Array<string>;
  linkWeight:number;
  entropy:number;
  x: number;
  y: number;
}

interface Edge {
  name:string;
  source:string;
  target:string;
  label:string
  weight:number
}

export default class Map {
  nodes: Node[];
  edges: Edge[];
  totalEntropy: number;

  constructor() {
    this.nodes = [];
    this.edges = [];
    this.totalEntropy = 0;
  }

  public CreateNodes(nodesList:any):void {
    this.nodes.forEach((node) => {
      nodesList[node.name] = { name: node.description, x: node.x, y: node.y };
    });
  }

  public CreateLinks(linkList:any):void {
    this.edges.forEach((edge) => {
      linkList[edge.name] = {
        source: edge.source, target: edge.target, label: edge.label + edge.weight, peso: 0,
      };
    });
  }

  public CalculateWeight(listEdges:any):void {
    const _edges:any = [];
    this.edges.forEach((edge) => {
      if (_edges[edge.source] === undefined) _edges[edge.source] = [];
      _edges[edge.source].push(edge.target);
    });
    this.nodes.forEach((node) => {
      node.link = _edges[node.name];
      if (node.link !== undefined) node.linkWeight = 1 / node.link.length;
      this.edges.forEach((edge) => {
        if (edge.source === node.name) {
          edge.weight = node.linkWeight;
        }
        listEdges[edge.name] = {
          source: edge.source, target: edge.target, label: `${edge.label} ${edge.weight}`, peso: edge.weight,
        };
      });
    });
  }

  /*
  public calcolaEntropiaNodoUscita():void {
    this.nodes.forEach((node) => {
      if (node.link !== undefined && node.link.length > 0) {
        const entropy = -1 * (node.link.length * (node.pesoLink * (Math.log2(node.pesoLink))));
        // eslint-disable-next-line no-param-reassign
        node.entropy = entropy;
      }
    });
  }*/

  public CalculateEntropy():void {
    this.nodes.forEach((node) => {
      const link:number[] = [];
      this.nodes.forEach((nodeEnter:Node) => {
        if (nodeEnter.link !== undefined && nodeEnter.link.length > 0) {
          for (const i of nodeEnter.link) {
            if (i === node.name) {
              link.push(nodeEnter.linkWeight * (Math.log2(nodeEnter.linkWeight)));
              break;
            }
          }
           node.entropy = 0;
          for (const y of link) node.entropy += y;
          node.entropy *= -1;
        }
      });
      this.GraphEntropy();
    });
  }

  private GraphEntropy():number {
    this.totalEntropy = 0;
    this.nodes.forEach((node) => {
      this.totalEntropy += node.entropy;
    });
    return this.totalEntropy;
  }
}
