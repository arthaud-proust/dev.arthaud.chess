const LOCAL_STORAGE_BASE = "dev.arthaud.chess";

export const localStorageKey = (key: string) => `${LOCAL_STORAGE_BASE}.${key}`;
