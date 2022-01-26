/**
 * This interface describes the nodes in the graph
 * @interface Node
 * @member name node name
 * @member description node description
 * @member links edges
 */
interface Node{
  name:string;
  index: number
  description:string;
  links:Array<string>;
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
      // eslint-disable-next-line no-param-reassign
      nodesList[node.name] = {
        name: node.name, order: node.index, x: node.x, y: node.y,
      };
    });
  }

  public CreateLinks(linkList:any):void {
    this.edges.forEach((edge) => {
      // eslint-disable-next-line no-param-reassign
      linkList[edge.name] = {
        source: edge.source, target: edge.target, label: edge.label + edge.weight, peso: 0,
      };
    });
  }

  public CalculateWeight(listEdges:any):void {
    // eslint-disable-next-line no-underscore-dangle
    const _edges:any = [];
    this.edges.forEach((edge) => {
      if (_edges[edge.source] === undefined) _edges[edge.source] = [];
      _edges[edge.source].push(edge.target);
    });
    this.nodes.forEach((node) => {
      // eslint-disable-next-line no-param-reassign
      node.links = _edges[node.name];
      // eslint-disable-next-line no-param-reassign
      if (node.links !== undefined) node.linkWeight = Number((1 / node.links.length).toFixed(3));
      this.edges.forEach((edge) => {
        if (edge.source === node.name) {
          // eslint-disable-next-line no-param-reassign
          edge.weight = node.linkWeight;
        }
        // eslint-disable-next-line no-param-reassign
        listEdges[edge.name] = {
          source: edge.source, target: edge.target, label: `${edge.label} ${edge.weight}`, peso: edge.weight,
        };
      });
      console.log(`collegamenti di ${node.index}`, node.links, node);
    });
  }

  /*
  public calcolaEntropiaNodoUscita():void {
    this.nodes.forEach((node) => {
      if (node.links !== undefined && node.links.length > 0) {
        const entropy = -1 * (node.links.length * (node.pesoLink * (Math.log2(node.pesoLink))));
        // eslint-disable-next-line no-param-reassign
        node.entropy = entropy;
      }
    });
  } */

  public CalculateEntropy():void {
    this.nodes.forEach((node) => {
      const link:number[] = [];
      this.nodes.forEach((nodeEnter:Node) => {
        if (nodeEnter.links !== undefined && nodeEnter.links.length > 0) {
          // eslint-disable-next-line no-restricted-syntax
          for (const i of nodeEnter.links) {
            if (i === node.name) {
              link.push(nodeEnter.linkWeight * (Math.log2(nodeEnter.linkWeight)));
              break;
            }
          }
          // eslint-disable-next-line no-param-reassign
          node.entropy = 0;
          // eslint-disable-next-line no-restricted-syntax,no-param-reassign
          for (const y of link) node.entropy += y;
          // eslint-disable-next-line no-param-reassign
          node.entropy *= -1;
        }
      });
      this.GraphEntropy();
    });
  }

  private GraphEntropy():number {
    this.totalEntropy = 0;
    this.nodes.forEach((node) => {
      this.totalEntropy += Number((node.entropy).toFixed(3));
    });
    return this.totalEntropy;
  }
}
