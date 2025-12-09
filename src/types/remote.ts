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
  createdAt: string;
  updatedAt: string;
  device?: Device;
  app?: {
    title: string;
    iconUrl: string;
  };
};
