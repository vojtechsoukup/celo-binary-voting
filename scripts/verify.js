const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const CONTRACT_ADDRESS = '0xa599509b41e66529750c2DBD28B2B6f8B913D281';
const EXPLORER_API = 'https://api.celoscan.io/api';

async function verifyContract() {
    try {
        // Read the contract source code
        const sourceCode = fs.readFileSync(
            path.join(__dirname, '../contracts/BinaryVoting.sol'),
            'utf8'
        );

        // Get compiler version and settings from truffle config
        const truffleConfig = require('../truffle-config.js');
        const compilerVersion = truffleConfig.compilers.solc.version;
        const optimizerSettings = truffleConfig.compilers.solc.settings.optimizer;

        // Prepare verification data
        const verificationData = {
            apikey: process.env.CELOSCAN_API_KEY,
            module: 'contract',
            action: 'verifysourcecode',
            sourceCode: sourceCode,
            contractaddress: CONTRACT_ADDRESS,
            codeformat: 'solidity-single-file',
            contractname: 'BinaryVoting',
            compilerversion: `v${compilerVersion}`,
            optimizationUsed: optimizerSettings.enabled ? '1' : '0',
            runs: optimizerSettings.runs,
            evmversion: 'default'
        };

        console.log('Submitting verification request...');
        const response = await axios.post(EXPLORER_API, null, {
            params: verificationData
        });

        if (response.data.status === '1') {
            console.log('Verification submitted successfully!');
            console.log('GUID:', response.data.result);
            console.log('Check verification status at:');
            console.log(`https://celoscan.io/address/${CONTRACT_ADDRESS}#code`);
        } else {
            console.error('Verification submission failed:', response.data.result);
        }
    } catch (error) {
        console.error('Error during verification:', error.message);
    }
}

verifyContract(); 