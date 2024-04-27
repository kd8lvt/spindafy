export class BaseGeneticist {
  constructor(mutation_chance) {
    this.cur_pop = [];
    this.mutation_chance = mutation_chance; //0-1
  }

  fitness_func() {
    throw new Error("NYI");
  }
}

export class Geneticist extends BaseGeneticist {
  constructor() {
    super(0.2);
  }

  fitness_func(popMember) {
    //Super ultra mega temporary fitness function
    let sum = 0;
		for (let key of Object.keys(popMember.genes)) {
      sum += popMember.genes[key];
    }
    sum /= Object.keys(popMember.gejes).length;
    return sum;
  }

  setup_genes(popMember) {
	  for (let i in popMember.parents_genes[0]) for (let key of Object.keys(popMember.parents_genes[0][i])) {
      if (!popMember.parents_genes[0][i].hasOwnProperty(key)) continue;
      if (popMember.genes[i] == null) popMember.genes[i] = {};
      popMember.genes[i][key] = ((popMember.parents_genes[0][i][key]+popMember.parents_genes[1][i][key])/2);
      if (Math.random() < this.mutation_chance) popMember.genes[i][key] = Math.max(0,Math.min(15,popMember.genes[i][key]+(Math.floor(Math.random()*3))*(Math.random()>0.5?1:-1)));
    }}
  }

  first_pop() {
    this.cur_pop = [];
    for (let i=0;i<this.popCount;i++) {
      this.cur_pop.push(new PopMember('random','random'));
    }
  }

  next_pop() {
    let prev_pop = this.cur_pop;
    this.cur_pop = [];
    let best_fit = -100;
    let second_best_fit = -101;
    let cur_avg;
    let fitness_cache = [];
    for (let idx in prev_pop) {
      let popMember = prev_pop[idx];
      fitness_cache[idx] = this.fitness_func(popMember);
      if (fitness_cache[idx] > best) {
        second_best_fit = best_fit;
        best_fit = fitness_cache[idx];
      }
    }
    let parents = [prev_pop[fitness_cache.indexOf(best_fit)],prev_pop[fitness_cache.indexOf(second_best_fit)]];

    for (let i=0;i<this.popCont;i++) {
      this.cur_pop.push(new PopMember(...parents));
      this.setupGenes(this.cur_pop[this.cur_pop.length-1]);
    }
  }
}

export class PopMember {
  constructor(parent1,parent2) {
    if (parent1 == 'random') parent1 = this.genRandom();
    if (parent2 == 'random') parent2 = this.genRandom();
    this.parents_genes = [parent1.genes,parent2.genes];
    this.genes = {};
  }

  genRandom() {
    let genes = [];
    for (let i=0;i<4;i++) {
      genes.push({x:Math.floor(Math.random()*16)-1,y:Math.floor(Math.random()*16)-1});
    }
    return {genes};
  }
}

function calcAvg(arr) {
  let sum = 0;
  for (let val of arr) {
    sum += val;
  }
  return sum/arr.length;
}
