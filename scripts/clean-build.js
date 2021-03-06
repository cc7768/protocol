import * as contracts from '../src/lib/contracts';
import deployed from '../migrations/deployed';
import fs from 'fs';
import promisify from 'es6-promisify';
import mkdirp from 'mkdirp';

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(mkdirp);

const DOCKER_NETWORK_ID = '1212';

async function clean() {
  const directory = __dirname + '/../build/test/';
  await mkdirAsync(directory);

  const promises = Object.keys(contracts).map(async contractName => {
    const contract = contracts[contractName];

    const cleaned = {
      contractName: contract.contractName,
      abi: contract.abi,
      bytecode: contract.bytecode,
      deployedBytecode: contract.deployedBytecode,
      sourceMap: contract.sourceMap,
      deployedSourceMap: contract.deployedSourceMap,
      source: contract.source,
      compiler: contract.compiler,
      networks: {},
      schemaVersion: contract.schemaVersion
    }

    if (deployed[contractName]) {
      cleaned.networks = deployed[contractName];
    }

    if (contract.networks[DOCKER_NETWORK_ID]) {
      cleaned.networks[DOCKER_NETWORK_ID] = {
        links: contract.networks[DOCKER_NETWORK_ID].links,
        address: contract.networks[DOCKER_NETWORK_ID].address,
        transactionHash: contract.networks[DOCKER_NETWORK_ID].transactionHash,
      }
    }

    const json = JSON.stringify(cleaned, null, 4);

    const filename = contractName + '.json';
    await writeFileAsync(directory + filename, json, 'utf8');

    console.log('Wrote ' + directory + filename);
  });

  await Promise.all(promises);
}

clean()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .then(() => process.exit(0));
