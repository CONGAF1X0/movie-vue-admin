import { defHttp } from '/@/utils/http/axios';
import { MovieListModel, Params, MovieDetailModel, ActorListModel } from './model/movieModel';

enum Api {
  MOVIE_LIST = '/movie/list',
  MOVIE_RUNTIME = '/movie/runtime',
  MOVIE_DETAIL = '/movie/get',
  ACTOR_LIST = '/actor/list',
  ACTOR_UPDATE = '/actor/update',
  ACTOR_DEL = '/actor/del',
  ACTOR_CREATE = '/actor/create',
}

// Get personal center-basic settings

export const getMovieList = (params: Params) => defHttp.get({ url: Api.MOVIE_LIST, params });

export const getMovieDetail = (params: string) =>
  defHttp.get<any>({ url: Api.MOVIE_DETAIL + '/' + params });

export const getActorList = (params: Params) => defHttp.get<any>({ url: Api.ACTOR_LIST, params });

export const getMovieRuntime = (x: number) =>
  defHttp.get<any>({ url: Api.MOVIE_RUNTIME, params: { movie_id: x } });

export const updateActor = (params) => defHttp.put<any>({ url: Api.ACTOR_UPDATE, params });
export const delActor = (params) => defHttp.delete<any>({ url: Api.ACTOR_DEL, params });
export const createActor = (params) => defHttp.post<any>({ url: Api.ACTOR_CREATE, params });
