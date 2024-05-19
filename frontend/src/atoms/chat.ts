import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const chatLayoutState = atom<TChatLayout>({
  key: 'chatLayout',
  default: 'default',
  effects_UNSTABLE: [persistAtom],
});

export const showCustomiseDetailsState = atom<boolean>({
  key: 'showCustomiseDetailsState',
  default: false,
});

export const showMemberDetailsState = atom<boolean>({
  key: 'showMemberDetailsState',
  default: false,
});

export const messageReplyState = atom<number>({
  key: 'messageReplyState',
  default: undefined,
});

export const followMessagesState = atom<boolean>({
  key: 'followMessagesState',
  default: true,
});
