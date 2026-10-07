/**
 * Network Connectivity Service.
 * Listens for online/offline state changes and triggers sync queues automatically.
 */

import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export type NetworkListener = (isConnected: boolean) => void;

class NetworkService {
  private isOnline = true;
  private listeners: NetworkListener[] = [];

  constructor() {
    this.init();
  }

  private init() {
    NetInfo.addEventListener((state: NetInfoState) => {
      const connected = Boolean(state.isConnected && state.isInternetReachable !== false);
      const changed = this.isOnline !== connected;
      this.isOnline = connected;

      if (changed) {
        this.notifyListeners(connected);
      }
    });

    // Check initial state
    NetInfo.fetch().then((state) => {
      this.isOnline = Boolean(state.isConnected && state.isInternetReachable !== false);
    });
  }

  public getIsOnline(): boolean {
    return this.isOnline;
  }

  public async checkConnection(): Promise<boolean> {
    const state = await NetInfo.fetch();
    this.isOnline = Boolean(state.isConnected && state.isInternetReachable !== false);
    return this.isOnline;
  }

  public subscribe(listener: NetworkListener): () => void {
    this.listeners.push(listener);
    listener(this.isOnline);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(isConnected: boolean) {
    this.listeners.forEach((listener) => {
      try {
        listener(isConnected);
      } catch (err) {
        console.error('Error in network listener:', err);
      }
    });
  }
}

export const networkService = new NetworkService();
