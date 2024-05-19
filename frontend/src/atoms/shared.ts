import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const authComponentModeState = atom<TAuthComponentMode>({
  key: 'authComponentModeState',
  default: 'signIn',
  effects_UNSTABLE: [persistAtom],
});
