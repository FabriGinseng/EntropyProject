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
  size: number;
  description:string;
  links: Array<any>;
  linkWeight:number;
  entropy:number;
}
/**
 * This interface describes the Edges in the graph
 * @interface Edge
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
  labelBelow:string
  weight:number
  probability:number
  isEdit:boolean
  isEditProb:boolean
}

/**
 * This class describes the Map
 * @class Map
 * @member nodes array of nodes
 * @member edges array of edges
 * @member totalEntropy
 * @member name map name
 * @member date creation date
 * @member author author details
 * @member description
 */
export default class Map {
  nodes: Node[];

  edges: Edge[];

  name: string;

  author: string;

  date: Date;

  description:string;

  totalEntropy: number;

  totalEntropyPerc: number;

  /**
   * @constructor of Map class
   */
  constructor() {
    this.nodes = [];
    this.edges = [];
    this.name = '';
    this.author = '';
    this.description = '';
    this.date = new Date();
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
      nodesList[node.name] = {
        name: node.name, order: node.index, size: 50, color: 'white',
      };
    });
  }

  /**
   * this function create a list of links
   * @param linkList
   */
  public CreateEdges(linkList:any):void {
    this.edges.forEach((edge) => {
      // eslint-disable-next-line no-param-reassign
      linkList[edge.name] = {
        source: edge.source, target: edge.target, label: `${edge.label}(${edge.weight})`, peso: edge.probability,
      };
    });
  }

  /**
   * the function return the weight of link
   * @param listEdges
   */
  public CalculateWeight(listEdges:any) {
    return new Promise<number>((resolve) => {
      const tempEdges:any = [];
      this.edges.forEach((edge) => {
        if (tempEdges[edge.source] === undefined) tempEdges[edge.source] = [];
        tempEdges[edge.source].push(edge.target);
      });
      this.nodes.forEach((node) => {
        // eslint-disable-next-line no-param-reassign
        node.links = tempEdges[node.name];
        let prova = 0;
        // eslint-disable-next-line no-param-reassign
        if (!(node.links === undefined)) {
          prova = +(1 / node.links.length).toFixed(3);
        }
        return resolve(prova);
      });

      /* this.edges.forEach((edge) => {
        if (edge.source === node.name) {
          // eslint-disable-next-line no-param-reassign
          edge.weight = node.linkWeight;
        }
        // eslint-disable-next-line no-param-reassign
        listEdges[edge.name] = {
          source: edge.source, target: edge.target, label: `${edge.label}`, peso: edge.weight,
        };
      }); */
    });
  }

  /**
   * the function make the sum of all probability in a node
   * @param listEdges
   */
  public CalculateProbabilitySum(listEdges:any):void {
    const tempEdges:any = [];
    this.edges.forEach((edge) => {
      if (tempEdges[edge.source] === undefined) tempEdges[edge.source] = [];
      tempEdges[edge.source].push({ target: edge.target, p: edge.probability });
    });
    this.nodes.forEach((node) => {
      // eslint-disable-next-line no-param-reassign
      node.links = tempEdges[node.name];
      // eslint-disable-next-line no-param-reassign
      if (!(node.links === undefined)) {
        // eslint-disable-next-line no-param-reassign
        node.linkWeight = 0;
        // eslint-disable-next-line no-restricted-syntax
        for (const pro of node.links) {
          // eslint-disable-next-line no-param-reassign
          node.linkWeight += pro.p;
        }
        console.log('peso totale', node.linkWeight);
      }
      this.edges.forEach((edge) => {
        if (edge.source === node.name) {
          // eslint-disable-next-line no-param-reassign
          edge.weight = node.linkWeight;
        }
        // eslint-disable-next-line no-param-reassign
        listEdges[edge.name] = {
          source: edge.source, target: edge.target, label: `${edge.label}`, peso: edge.probability,
        };
      });
    });
  }

  /**
   * the function verify if the probability exceed 1
   */
  public VerifyProbability():boolean {
    // eslint-disable-next-line no-restricted-syntax
    for (const node of this.nodes) {
      if (node.links !== undefined && node.links.length > 0) {
        let probability = 0;
        // eslint-disable-next-line no-restricted-syntax
        for (const i of node.links) {
          if (i.p === 0) return false;
          probability += i.p;
        }
        if (probability !== 1) return false;
      }
    }
    return true;
  }

  /**
   * the function return the edge entropy
   * @param listEdges
   * @constructor
   */
  public CalculateEntropyEdges(listEdges:any):void {
    this.nodes.forEach((node) => {
      this.edges.forEach((edge) => {
        if (edge.source === node.name) {
          const entropy = -1 * (edge.probability * (Math.log2(edge.probability)));
          // eslint-disable-next-line no-param-reassign
          listEdges[edge.name].label = `P(${edge.probability}) H(${entropy.toFixed(2)})`;
          // eslint-disable-next-line no-param-reassign
          listEdges[edge.name].labelBelow = `${edge.label}`;
        }
      });
    });
  }

  /**
   * The function calculates the nodes entropy
   */
  public CalculateEntropy():void {
    this.nodes.forEach((node) => {
      try {
        const link:number[] = [];

        this.nodes.forEach((nodeEnter:Node) => {
          if (nodeEnter.links !== undefined && nodeEnter.links.length > 0) {
            // eslint-disable-next-line no-restricted-syntax
            for (const i of nodeEnter.links) {
              if (i.target === node.name) {
                link.push(i.p * (Math.log2(i.p)));
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
          /* this.edges.forEach((edge) => {
            if (edge.target === node.name) {
              // eslint-disable-next-line no-param-reassign
              listEdges[edge.name].label = `${edge.label} (${node.entropy.toFixed(3)})`;
            }
          }); */
        });

        this.CalculateGraphEntropy();
        // eslint-disable-next-line no-restricted-globals
        this.totalEntropyPerc = !isNaN(this.totalEntropyPerc) ? Number((100 * (this.totalEntropy
          / (Math.log2(this.factorialize(this.nodes.length - 1))))).toFixed(3)) : 0;
      } catch (error:any) {
        console.log(error);
      }
    });
  }

  /**
   * this method calculate the factorial of a number
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
  private CalculateGraphEntropy():number {
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
          if (y.target === i.name) flag = false;
        }
      }
      if (nodeSelected.name === i.name) flag = false;

      if (flag) {
        if (i.links) {
          for (let z = 0; z < i.links.length; z += 1) {
            const y = i.links[z];
            if (nodeSelected.name === y.target) {
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
   * The function checks if the node is linking with another
   * @param nodeSelected
   * @return GenerateListLinks
   */
  public CheckNodesDelete(nodeSelected:Node):boolean {
    let isLink = false;
    for (let i = 0; i < this.nodes.length; i += 1) {
      if (this.nodes[i].links !== undefined) {
        for (let z = 0; z < this.nodes[i].links.length; z += 1) {
          if (this.nodes[i].links[z] === nodeSelected.name) {
            isLink = true;
            break;
          }
        }
      }
      if (isLink) break;
    }
    return isLink;
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
