
// ENity used for Factory Desing pattern, to reuse a lot of code
class ModelFactory {
    constructor(models) {
    this.models = models;
  }

  // Get the model of models/index.js
  getModel(entityName) {
    const model = this.models[entityName];
    if (!model) {
      throw new Error(`Model "${entityName}" doesnt exist. `);
    }
    return model;
  };

  async create(entityName, data) {
    const model = this.getModel(entityName);
    return await model.create(data);
  };

}