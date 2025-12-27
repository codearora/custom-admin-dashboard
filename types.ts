
export interface CallDurationData {
  time: string;
  duration: number;
}

export interface SadPathData {
  name: string;
  value: number;
  color: string;
}

export interface UserPreferences {
  email: string;
  customSadPathData?: SadPathData[];
}

export enum ModalState {
  NONE,
  EMAIL_ENTRY,
  DATA_EDITOR,
  OVERWRITE_CONFIRM
}
