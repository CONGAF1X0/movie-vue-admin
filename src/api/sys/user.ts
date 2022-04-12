import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel, SignupParams } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/login',
  Logout = '/logout',
  GetUserInfo = '/user/info/get',
  GetPermCode = '/getPermCode',
  Refresh = '/refresh',
  GetMobileCaptcha = '/create_mobile_captcha',
  LoginByMobileCaptcha = '/login_by_mobile_captcha',
  Signup = '/signup',
  IsAccountExist = '/is_account_exist',
}

/**
 * @description: user login api
 */
export const loginApi = (params: LoginParams, mode: ErrorMessageMode = 'modal') =>
  defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    { errorMessageMode: mode, isTransformResponse: true },
  );

export const loginByMobileCaptcha = (mobile: string, captcha: string) =>
  defHttp.post({ url: Api.LoginByMobileCaptcha, params: { identity: mobile, captcha: captcha } });

export const signup = (params: SignupParams) => defHttp.post({ url: Api.Signup, params });

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get({ url: Api.GetUserInfo }, { withToken: true });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.post({ url: Api.Logout });
}

export function doRefresh(token: string) {
  return defHttp.post({ url: Api.Refresh, params: { refresh_token: token } });
}

export function getMobileCaptcha(mobile: string, type: string) {
  return defHttp.post({ url: Api.GetMobileCaptcha, params: { mobile: mobile, action_type: type } });
}

export function isAccountExist(value: string) {
  return defHttp.post({ url: Api.IsAccountExist, params: { username: value } });
}
