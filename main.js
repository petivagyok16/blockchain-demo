const SHA256 = require('crypto-js/sha256');

/**
 *  --- Proof of work ---
 * PoW mechanism is needed to prevent tamper with the blockchain.
 * Without proof of work people would be able to create hundreds of thousands
 * of blocks per second and spam our blockchain.
 * 
 * There's also a security issue: anybody can change the content of the blocks
 * and simply recalculate the hash of each block and we end up with a totally
 * manipulated blockchain.
 * 
 * With PoW mechanism you have to prove that you put a lot of computing power
 * into making a Block.
 * This process is also called --- mining ---.
 */

/**
 * 
 * index: tells us where the block sits on the chain (optional)
 * timestamp: when the block was created
 * data: includes any data e.g. details of the transaction, how much money, who was the sender etc.
 * previousHash: self explanatory
 */
class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  mineBlock(difficulty) {
    // While loop runs until the hash has the requested amount of Leading Zeros specified by difficulty
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1 ).join('0')) {
      // Nonce needs to trigger the hash to change every time loop runs once otherwise loop would be infinite.
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log(`
    CONGRATS! You successfully mined the block! Your reward is 50 AnnaCoin!
    Mined block: `, this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
  }

  createGenesisBlock() {
    return new Block(0, "01/01/2018", "Genesis block", "0")
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

let annaCoin = new Blockchain();

console.log(`Mining block 1...`);
annaCoin.addBlock(new Block(1, "23/01/2018", { amount: 4 }));
console.log(`- - - -`);

console.log(`Mining block 2...`);
annaCoin.addBlock(new Block(2, "24/01/2018", { amount: 6 }));
console.log(`- - - -`);

console.log(`Mining block 3...`);
annaCoin.addBlock(new Block(3, "25/01/2018", { amount: 12 }));
console.log(`- - - -`);

console.log(`Mining block 4...`);
annaCoin.addBlock(new Block(4, "26/01/2018", { amount: 16 }));
console.log(`- - - -`);
