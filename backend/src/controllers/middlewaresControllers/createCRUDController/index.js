const paths = require('../../../config/paths.js');
const { modelsFiles } = require(paths.modelsUtils);

const mongoose = require('mongoose');

const create = require('./create');
const read = require('./read');
const update = require('./update');
const remove = require('./remove');
const search = require('./search');
const filter = require('./filter');
const summary = require('./summary');
const listAll = require('./listAll');
const paginatedList = require('./paginatedList');

const createCRUDController = (modelName) => {
  if (!modelsFiles.includes(modelName)) {
    throw new Error(`Model ${modelName} does not exist`);
  }

  // ✅ FIX: Lazy-load the model inside each method
  // This ensures the model is only retrieved when the route is actually called,
  // not when the controller is created at module load time
  const getModel = () => mongoose.model(modelName);

  let crudMethods = {
    create: (req, res) => create(getModel(), req, res),
    read: (req, res) => read(getModel(), req, res),
    update: (req, res) => update(getModel(), req, res),
    delete: (req, res) => remove(getModel(), req, res),
    list: (req, res) => paginatedList(getModel(), req, res),
    listAll: (req, res) => listAll(getModel(), req, res),
    search: (req, res) => search(getModel(), req, res),
    filter: (req, res) => filter(getModel(), req, res),
    summary: (req, res) => summary(getModel(), req, res),
  };
  return crudMethods;
};

module.exports = createCRUDController;
