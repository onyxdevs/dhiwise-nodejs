/* eslint-disable no-console */
/* global _ */
const fs = require('fs');
const { PROJECT_TYPE } = require('./constants/constant');

global.__basedir = __dirname;
const CodeGenerator = require('./codeGenerator');

function trimModelNameFromInput (models) {
  const oldModelNames = _.keys(models);
  let newModelNames = [];
  _.forEach(models, (model, modelName) => {
    newModelNames.push(_.trim(modelName));
  });
  newModelNames = _.uniq(newModelNames);
  if (_.isEqual(oldModelNames, newModelNames)) { return models; }

  throw new Error('modelName should not contain spaces');
}

async function main (inputFilepath) {
  let projectPath;
  try {
    const inputData = fs.readFileSync(inputFilepath, { encoding: 'utf8' });
    const jsonData = JSON.parse(inputData);
    const {
      config, id,
    } = jsonData;
    jsonData.models = trimModelNameFromInput(jsonData.models);
    projectPath = `${config.path}/${id}`;
    if (jsonData.adapter && jsonData.ORM) {
      if (jsonData.ORM !== 'mongoose') {
        jsonData.projectType = `${jsonData.projectType}_${(jsonData.ORM).toUpperCase()}`;
      }
    }
    const codeGenerator = new CodeGenerator(jsonData.projectType || PROJECT_TYPE.MVC);
    console.time();
    await codeGenerator.createApp({
      directory: projectPath,
      projectName: config.projectName,
      jsonData,
    });
  } catch (err) {
    // console.log(err);
    throw new Error(err);
  }
}

module.exports = main;
