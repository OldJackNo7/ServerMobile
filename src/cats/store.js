import dataStore from 'nedb-promise';

export class CatStore {
  constructor({ filename, autoload }) {
    this.store = dataStore({ filename, autoload });
  }
  
  async find(props) {
    return this.store.cfind(props).sort({breed: 1}).exec();
  }

  async getAllPaginated(findValue, start, numberOfItems) {
    return this.store.cfind(findValue).sort({breed: 1}).skip(start).limit(numberOfItems).exec();
  }
  
  async findOne(props) {
    return this.store.findOne(props);
  }
  
  async insert(cat) {
    let catBreed = cat.breed;
    if (!catBreed) { // validation
      throw new Error('Missing breed property')
    }
    return this.store.insert(cat);
  };
  
  async update(props, cat) {
    return this.store.update(props, cat);
  }
  
  async remove(props) {
    return this.store.remove(props);
  }
}

export default new CatStore({ filename: './db/cats.json', autoload: true });