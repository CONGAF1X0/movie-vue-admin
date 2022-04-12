/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
  type: number;
}
export interface SignupParams {
  username: string;
  mobile: string;
  password: string;
  captcha: string;
}
export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  uid: string | number;
  tokens: any;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  uid: string | number;
  role: number;
  user_name: string;
  nick_name?: string;
  gender?: number;
  birthday: number;
  mobile: number;
  email: string;
  avatar: string;
  cinema_id: string | number;
}
