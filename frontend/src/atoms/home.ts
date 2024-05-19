import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const homeModeState = atom<THomeMode>({
  key: 'homeModeState',
  default: 'friends',
  effects_UNSTABLE: [persistAtom],
});

export const homeSettingsModalState = atom<boolean>({
  key: 'homeSettingsModalState',
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const homeToggleDetailsState = atom<boolean>({
  key: 'homeToggleDetailsState',
  default: true,
  effects_UNSTABLE: [persistAtom],
});

export const homeRoomListModalState = atom<TRoom[]>({
  key: 'homeRoomListModalState',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const homeUserListState = atom<TUser[]>({
  key: 'homeUserListState',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const messageListState = atom<TMessage[]>({
  key: 'messageListState',
  default: [],
  // effects_UNSTABLE: [persistAtom],
});
