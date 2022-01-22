export default class Graph {
  size: number;

  matrix:any;

  constructor(size = 1) {
    this.size = size;
    this.matrix = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < size; i++) {
      this.matrix.push([]);
      // eslint-disable-next-line no-plusplus
      for (let j = 0; j < size; j++) {
        this.matrix[i][j] = 0;
      }
    }
  }

  addVertex() {
    // eslint-disable-next-line no-plusplus
    this.size++;
    this.matrix.push([]);
    for (let i = 0; i < this.size; i++) {
      this.matrix[i][this.size - 1] = 0;
      this.matrix[this.size - 1][i] = 0;
    }
  }

  addEdge(vertex1:number, vertex2:number, weight = 1) {
    if (vertex1 > this.size - 1 || vertex2 > this.size - 1) {
      console.log('invalid vertex');
    } else if (vertex1 === vertex2) {
      console.log('same vertex');
    } else {
      this.matrix[vertex1][vertex2] = weight;
      this.matrix[vertex2][vertex1] = weight;
    }
  }

  removeEdge(vertex1:number, vertex2:number) {
    if (vertex1 > this.size - 1 || vertex2 > this.size - 1) {
      console.log('invalid vertex');
    } else if (vertex1 === vertex2) {
      console.log('same vertex');
    } else {
      this.matrix[vertex1][vertex2] = 0;
      this.matrix[vertex2][vertex1] = 0;
    }
  }
}
