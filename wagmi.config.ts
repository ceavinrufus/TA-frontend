import { createConfig, http, cookieStorage, createStorage } from "wagmi";
import { sepolia, mainnet } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export function getConfig() {
  return createConfig({
    chains: [sepolia, mainnet],
    connectors: [metaMask()],
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    transports: {
      [sepolia.id]: http(),
      [mainnet.id]: http(),
    },
  });
}
