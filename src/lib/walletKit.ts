import {
  StellarWalletsKit,
  WalletNetwork,
  FreighterModule,
  xBullModule,
  AlbedoModule,
  LobstrModule,
} from '@creit.tech/stellar-wallets-kit';

/**
 * Global StellarWalletsKit instance.
 * v1.9.5 API: openModal(), getAddress(), sign(), setWallet()
 */
export const walletKit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  modules: [
    new FreighterModule(),
    new xBullModule(),
    new AlbedoModule(),
    new LobstrModule(),
  ],
});
