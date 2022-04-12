import { defHttp, amapHttp } from '/@/utils/http/axios';
import {
  CinemaInfoModel,
  HallListModel,
  MovieSesHallListModel,
  Params,
  SessionModel,
  CinemaInfoModel,
  CreateHallParam,
} from './model/cinemaModel';

enum Api {
  CINEMA_INFO = '/cinema/get',
  REGEO = '/v3/geocode/regeo?key=3beb329cdf02ebeeb07f3c13836e1054',
  HALL_LIST = '/cinema/hall/list',
  SESSION_LIST = '/cinema/session/list',
  SESSION_UPDATE = '/cinema/session/update',
  SESSION_CREATE = '/cinema/session/create',
  SESSION_DELETE = '/cinema/session/del',
  CINEMA_UPDATE = '/cinema/update',
  CINEMA_CREATE = '/cinema/create',
  HALL_CREATE = '/cinema/hall/create',
  HALL_UPDATE = '/cinema/hall/update',
}

// Get personal center-basic settings

export const getCinemaInfo = (params: Params) =>
  defHttp.get<any>({ url: Api.CINEMA_INFO + '/' + params.cinema_id });
export const getHallList = (params: Params) => defHttp.get<any>({ url: Api.HALL_LIST, params });

export const getSessionList = (params: Params) =>
  defHttp.get<any>({ url: Api.SESSION_LIST, params });

export const updateSession = (params: SessionModel) =>
  defHttp.put<any>({ url: Api.SESSION_UPDATE, params });

export const createSession = (params) => defHttp.post<any>({ url: Api.SESSION_CREATE, params });

export const deleteSession = (params) => defHttp.delete<any>({ url: Api.SESSION_DELETE, params });

export const updateCinemaInfo = (params: CinemaInfoModel) =>
  defHttp.put<any>({ url: Api.CINEMA_UPDATE, params });

export const createCinema = (params: CinemaInfoModel) =>
  defHttp.post<any>({ url: Api.CINEMA_CREATE, params });

export const createHall = (params: CreateHallParam) =>
  defHttp.post({ url: Api.HALL_CREATE, params });

export const updateHall = (params) => defHttp.put({ url: Api.HALL_UPDATE, params });

export const regeoApi = (params: string) => {
  return amapHttp.get({
    url: Api.REGEO,
    params,
  });
};
