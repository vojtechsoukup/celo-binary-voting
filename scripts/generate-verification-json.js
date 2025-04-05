const fs = require('fs');
const path = require('path');

// Read the contract source code
const sourceCode = fs.readFileSync(
    path.join(__dirname, '../contracts/BinaryVoting.sol'),
    'utf8'
);

// Get compiler settings from truffle config
const truffleConfig = require('../truffle-config.js');
const compilerVersion = truffleConfig.compilers.solc.version;
const optimizerSettings = truffleConfig.compilers.solc.settings.optimizer;

// Create the Standard JSON input
const jsonInput = {
    language: "Solidity",
    sources: {
        "BinaryVoting.sol": {
            content: sourceCode
        }
    },
    settings: {
        optimizer: {
            enabled: optimizerSettings.enabled,
            runs: optimizerSettings.runs
        },
        evmVersion: "london",
        outputSelection: {
            "*": {
                "*": [
                    "abi",
                    "evm.bytecode",
                    "evm.deployedBytecode",
                    "evm.methodIdentifiers"
                ]
            }
        }
    }
};

// Write the JSON to a file
fs.writeFileSync(
    path.join(__dirname, 'verification-input.json'),
    JSON.stringify(jsonInput, null, 2)
);

console.log('Standard JSON input generated successfully!');
console.log('File saved as: scripts/verification-input.json'); 