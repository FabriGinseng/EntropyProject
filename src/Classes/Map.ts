/**
 * @author Antonio Fabrizio Fiume
 * @version 1.0.0
 */

/**
 * This interface describes the nodes in the graph
 * @interface Node
 * @member name node name
 * @member description node description
 * @member links edges of graph
 * @member index the order in which the node is added in the graph
 * @member linkWeight the weight of node
 * @member entropy the entropy
 */
export interface Node{
  name:string;
  index: number
  description:string;
  links:Array<string>;
  linkWeight:number;
  entropy:number;
}
/**
 * This interface describes the Edges in the graph
 * @interface Node
 * @member name edge name
 * @member source node source
 * @member target node target
 * @member label the label will display the weight
 * @member weight the weight of Edge
 */
export interface Edge {
  name:string;
  source:string;
  target:string;
  label:string
  weight:number
}

/**
 * This class describes the Map
 * @class Map
 * @member nodes array of nodes
 * @member edges array of edges
 * @member totalEntropy
 */
export default class Map {
  nodes: Node[];

  edges: Edge[];

  totalEntropy: number;

  totalEntropyPerc: number;

  /**
   * @constructor of Map class
   */
  constructor() {
    this.nodes = [];
    this.edges = [];
    this.totalEntropy = 0;
    this.totalEntropyPerc = 0;
  }

  /**
   *  This is a function that create a list of nodes
   *  @param {*} nodesList - this parameter is loaded with nodes
   */
  public CreateNodes(nodesList:any):void {
    this.nodes.forEach((node) => {
      // eslint-disable-next-line no-param-reassign
      nodesList[node.name] = { name: node.name, order: node.index };
    });
  }

  /**
   * this function create a list of links
   * @param linkList
   */
  public CreateLinks(linkList:any):void {
    this.edges.forEach((edge) => {
      // eslint-disable-next-line no-param-reassign
      linkList[edge.name] = {
        source: edge.source, target: edge.target, label: `${edge.label}(${edge.weight})`, peso: 0,
      };
    });
  }

  /**
   * the function return the weight of link
   * @param listEdges
   */
  public CalculateWeight(listEdges:any):void {
    const tempEdges:any = [];
    this.edges.forEach((edge) => {
      if (tempEdges[edge.source] === undefined) tempEdges[edge.source] = [];
      tempEdges[edge.source].push(edge.target);
    });
    this.nodes.forEach((node) => {
      // eslint-disable-next-line no-param-reassign
      node.links = tempEdges[node.name];
      // eslint-disable-next-line no-param-reassign
      if (!(node.links === undefined)) node.linkWeight = Number((1 / node.links.length).toFixed(3));
      this.edges.forEach((edge) => {
        if (edge.source === node.name) {
          // eslint-disable-next-line no-param-reassign
          edge.weight = node.linkWeight;
        }
        // eslint-disable-next-line no-param-reassign
        listEdges[edge.name] = {
          source: edge.source, target: edge.target, label: `${edge.label} (${edge.weight})`, peso: edge.weight,
        };
      });
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
  /**
   * The function calculates the nodes entropy
   */
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
      const result = this.GraphEntropy();
      // eslint-disable-next-line max-len
      this.totalEntropyPerc = Number((100 * (this.totalEntropy / (Math.log2(this.factorialize(this.nodes.length - 1))))).toFixed(2));
    });
  }

  /**
   * this method calculate a number factorial
   * @param num
   * @return factorial
   */
  factorialize(num: number):number {
    if (num < 0) return -1;
    if (num === 0) return 1;

    return (num * this.factorialize(num - 1));
  }

  /**
   * A private function that calculates the total entropy
   * @private
   * @return totalEntropy
   */
  private GraphEntropy():number {
    this.totalEntropy = 0;
    this.nodes.forEach((node) => {
      this.totalEntropy += Number((node.entropy).toFixed(3));
    });
    return this.totalEntropy;
  }

  /**
   * The function checks whether the links loop and returns the list of nodes that can be linked
   * from the pass node as a parameter
   * @param nodeSelected
   * @return GenerateListLinks
   */
  public CheckCycle(nodeSelected:Node):Node[] {
    const arrayNode:Node[] = [];
    const tempNodes:Node[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const i of this.nodes) {
      let flag = true;
      if (nodeSelected.links) {
        for (let z = 0; z < nodeSelected.links.length; z += 1) {
          const y = nodeSelected.links[z];
          if (y === i.name) flag = false;
        }
      }
      if (nodeSelected.name === i.name) flag = false;

      if (flag) {
        if (i.links) {
          for (let z = 0; z < i.links.length; z += 1) {
            const y = i.links[z];
            if (nodeSelected.name === y) {
              tempNodes.push(i);
              flag = false;
              break;
            }
          }
        }
      }
      if (flag) arrayNode.push(i);
    }
    return this.GenerateListLinks(tempNodes, arrayNode);
  }

  /**
   * The function checks whether the links loop and returns the list of nodes that can be linked
   * from the pass node as a parameter
   * @param nodeSelected
   * @return GenerateListLinks
   */
  public CheckNodesDelete(nodeSelected:Node):boolean {
    let flag = false;
    for (let i = 0; i < this.nodes.length; i += 1) {
      if (this.nodes[i].links !== undefined) {
        for (let z = 0; z < this.nodes[i].links.length; z += 1) {
          if (this.nodes[i].links[z] === nodeSelected.name) {
            flag = true;
            break;
          }
        }
      }
      if (flag) break;
    }
    return flag;
  }

  /**
   * The function return the list of links that the node can be linked
   * @param tempNodes
   * @param arrayNode
   * @private
   * @return arrayNode
   */
  private GenerateListLinks(tempNodes:Node[], arrayNode: Node[]): Node[] {
    const arrayN = arrayNode;
    const arrayControl = tempNodes;
    for (let i = 0; i < arrayControl.length; i += 1) {
      // const flag = false;
      this.nodes.forEach((z) => {
        if (z.links !== undefined) {
          z.links.forEach((link) => {
            if (link === arrayControl[i].name) {
              for (let k = 0; k < arrayN.length; k += 1) {
                if (arrayN[k].name === z.name) {
                  arrayControl.push(z);
                  arrayN.splice(+k, 1);
                }
              }
            }
          });
        }
      });
    }
    return arrayN;
  }
}
