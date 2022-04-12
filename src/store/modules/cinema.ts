import type { ErrorMessageMode } from '/#/axios';
import { defineStore } from 'pinia';
import { store } from '/@/store';

import { GetUserInfoModel, LoginParams } from '/@/api/sys/model/userModel';
import type { CinemaInfoModel } from '/@/api/demo/model/cinemaModel';

interface CinemaState {
  cinemaInfo: Nullable<CinemaInfoModel>;
}
export const useCinemaStore = defineStore({
  id: 'app-cinema',
  state: (): CinemaState => ({
    cinemaInfo: null,
  }),
  getters: {
    getCinemaInfo(): Nullable<CinemaInfoModel> {
      return this.cinemaInfo;
    },
  },
  actions: {
    setCinemaInfo(info: CinemaInfoModel | null) {
      this.cinemaInfo = info;
    },
    resetState() {
      this.cinemaInfo = null;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const data = await loginApi(loginParams, mode);
        const { token } = data;

        // save token
        this.setToken(token);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});

// Need to be used outside the setup
export function useCinemaStoreWithOut() {
  return useCinemaStore(store);
}
