export type InstallStatus =
  | "QUEUED"
  | "DELIVERED"
  | "DOWNLOADING"
  | "INSTALLING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELED";

export type Device = {
  id: string;
  name: string;
  platform: string;
  osVersion?: string | null;
  appVersion?: string | null;
  pushToken?: string | null;
  isOnline: boolean;
  lastSeen: string;
  createdAt: string;
};

export type RemoteInstallTask = {
  id: string;
  appId: string;
  deviceId: string;
  status: InstallStatus;
  progress: number;
  message?: string | null;
  downloadUrl?: string | null;
  hash?: string | null;
  simulateDuration: number;
  fileSize: string;
  downloadSpeed?: string | null;
  createdAt: string;
  updatedAt: string;
  device?: Device;
  app?: {
    id?: string;
    title: string;
    iconUrl: string;
  };
};
