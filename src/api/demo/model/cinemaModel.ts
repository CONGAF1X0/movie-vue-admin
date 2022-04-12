import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';
import { MovieModel } from './movieModel';
export interface Params {
  cinema_id?: number | string;
  t?: number;
  page?: number;
  pageSize?: number;
}
export interface CreateHallParam {
  cinema_id: number | string;
  hall_name: string;
  capacity: string;
}
export interface CinemaInfoModel {
  cinema_id: number;
  cinema_name: string;
  mobile: string;
  province: string;
  city: string;
  district: string;
  location: string;
  longitude: number;
  latitude: number;
}

export interface HallModel {
  hall_id: number;
  hall_name: string;
  cinema_id: number;
  capacity: string;
}
export interface SessionModel {
  cinema_id: number;
  movie_id: number;
  session_id: number;
  hall_id: number;
  start_time: number;
  end_time: number;
  prices: number;
}

export interface SessHallModel extends HallModel, SessionModel {}
export interface MovieSesHallModel extends MovieModel {
  children: SessHallModel[];
}

export type HallListModel = BasicFetchResult<HallModel>;

export type MovieSesHallListModel = BasicFetchResult<MovieSesHallModel>;
