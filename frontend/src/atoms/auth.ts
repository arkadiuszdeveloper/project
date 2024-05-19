import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const accessTokenState = atom<string>({
  key: 'accessTokenState',
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const userDataState = atom<{ id: number }>({
  key: 'userDataState',
  default: { id: 0 },
  effects_UNSTABLE: [persistAtom],
});

export const emailState = atom<string>({
  key: 'emailState',
  default: "",
  effects_UNSTABLE: [persistAtom],
});
