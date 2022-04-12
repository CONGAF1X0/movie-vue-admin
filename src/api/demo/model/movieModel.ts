import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export interface Params {
  query?: string;
  movie_id?: number | string;
  page?: number;
  page_size?: number;
}

export interface MovieModel {
  movie_id: number;
  movie_name: string;
  director: string;
  stars_ids: string;
  starts: string;
  runtime: string;
  genre: string;
  rating: string;
  cover: string;
}

export interface MovieDetailModel extends MovieModel {
  storyline: string;
  release: string;
  box_office: string;
}

export interface ActorModel {
  actor_id: number;
  name1: string;
  name2: string;
  birthday: string;
  introduction: string;
  image: string;
}

export type ActorListModel = BasicFetchResult<ActorModel>;
export type MovieListModel = BasicFetchResult<MovieModel>;
