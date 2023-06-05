class Scorer {
  constructor() {
    this.score = 0;
    this.elements = {}
    this.weigths = {}
  }

  //multiply element score by its weight
  calculateScore() {
    let score = 0;
    for (let element in this.elements) {
      score += this.elements[element] * this.weigths[element];
    }
    return score;
  }
}

const scorer = new Scorer();

export default scorer;