import CollectionConfigInterface from '../lib/CollectionConfigInterface';
import * as Networks from '../lib/Networks';
import * as Marketplaces from '../lib/Marketplaces';
import whitelistAddresses from './whitelist.json';

const CollectionConfig: CollectionConfigInterface = {
  testnet: Networks.ethereumTestnet,
  mainnet: Networks.ethereumMainnet,
  // The contract name can be updated using the following command:
  // yarn rename-contract NEW_CONTRACT_NAME
  // Please DO NOT change it manually!
  contractName: "TheRetros",
  tokenName: "The Retros",
  tokenSymbol: "TRTROS",
  hiddenMetadataUri: "ipfs://QmYveMvheCgWdM8kCYK6X9LtvrPQG9wz8ub2ybx5zAxw2W",
  maxSupply: 6969,
  whitelistSale: {
    cost1: 0,
    cost2: 0.005,
    maxMintAmountPerTx: 3,
  },
  preSale: {
    cost1: 0.0055,
    cost2: 0.0055,
    maxMintAmountPerTx: 3,
  },
  publicSale: {
    cost1: 0.0055,
    cost2: 0.0055,
    maxMintAmountPerTx: 3,
  },
  contractAddress: "0xE6625Ff0466e1C8B7489Fa2c28F7fFFAa2811e6e",
  marketplaceIdentifier: "TRTROS",
  marketplaceConfig: Marketplaces.openSea,
  whitelistAddresses,
};

export default CollectionConfig;
