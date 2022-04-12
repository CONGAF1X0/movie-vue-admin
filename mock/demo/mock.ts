import { MockMethod } from 'vite-plugin-mock';
import { resultSuccess, resultError, resultPageSuccess } from '../_util';
import { ResultEnum } from '../../src/enums/httpEnum';

const cinemaInfo = {
  cinema_id: 1,
  cinema_name: 'zhkucinema',
  mobile: 11111111111,
  province: '广东省',
  city: '广州市',
  district: '白云区',
  location: '钟落潭镇广新路388号',
  longitude: 113.451767,
  latitude: 23.37938,
};
const userInfo = {
  name: 'Vben',
  userid: '00000001',
  email: 'test@gmail.com',
  signature: '海纳百川，有容乃大',
  introduction: '微笑着，努力着，欣赏着',
  title: '交互专家',
  group: '某某某事业群－某某平台部－某某技术部－UED',
  tags: [
    {
      key: '0',
      label: '很有想法的',
    },
    {
      key: '1',
      label: '专注设计',
    },
    {
      key: '2',
      label: '辣~',
    },
    {
      key: '3',
      label: '大长腿',
    },
    {
      key: '4',
      label: '川妹子',
    },
    {
      key: '5',
      label: '海纳百川',
    },
  ],
  notifyCount: 12,
  unreadCount: 11,
  country: 'China',
  address: 'Xiamen City 77',
  phone: '0592-268888888',
};
const HallList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 20; index++) {
    result.push({
      hall_id: `${index}`,
      hall_name: `@name`,
      cinema_id: `${index}`,
      capacity: '2x3',
    });
  }
  return result;
})();
const MovieList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 20; index++) {
    result.push({
      movie_id: index,
      movie_name: '@cname',
      director: '@cname',
      stars_ids: '@range',
      starts: '@cname',
      runtime: '144min',
      genre: '@cword',
      rating: '@interger(1,10)',
    });
  }
  return result;
})();
const ActorList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 20; index++) {
    result.push({
      actor_id: index,
      name1: '@cname',
      name2: '@name',
      birthday: '@date',
      introduction: '@sentence(3, 5)',
      image: '@avatar',
    });
  }
  return result;
})();
const SessionList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 10; index++) {
    result.push({
      movie_id: '@integer(1,5)',
      movie_name: '@cname',
      director: '@cname',
      stars_ids: '@range',
      starts: '@cname',
      runtime: '144min',
      genre: '@cword',
      rating: '@interger(1,10)',
    });
    const ses: any = [];
    for (let j = 0; j < 3; j++) {
      ses.push({
        hall_id: '@integer(1,3)',
        hall_name: '@cword',
        capacity: '2x3',
        session_id: '@guid',
        movie_id: '@integer(1,5)',
        cinema_id: 1,
        start_time: '@datetime',
        end_time: '@datetime',
        price: '@float(0,100)',
      });
    }
    result[index].children = ses;
  }

  return result;
})();

const MovieDetail = {
  movie_id: 1,
  movie_name: '蜘蛛侠',
  director: '导演名',
  stars_ids: '1,2,3,4,5',
  starts: '汤姆赫兰德 | 安德鲁加菲 | 托比马奎尔',
  runtime: '144min',
  genre: '科幻/动作',
  rating: '8.8',
  storyline: '@text',
  release: '@date',
  box_office: '9999999',
  cover:
    'https://pic.iqiyipic.com.aibaily.cn/img/upload/vod/20211216-1/20073cf3c3b0740c90203a8675051413.jpg',
};
export default [
  {
    url: '/basic-api/account/getAccountInfo',
    timeout: 1000,
    method: 'get',
    response: () => {
      return resultSuccess(userInfo);
    },
  },
  {
    url: '/basic-api/user/sessionTimeout',
    method: 'post',
    statusCode: 401,
    response: () => {
      return resultError();
    },
  },
  {
    url: '/basic-api/user/tokenExpired',
    method: 'post',
    statusCode: 200,
    response: () => {
      return resultError('Token Expired!', { code: ResultEnum.TIMEOUT as number });
    },
  },
  {
    url: '/basic-api/cinema/getinfo',
    timeout: 1000,
    method: 'get',
    response: () => {
      return resultSuccess(cinemaInfo);
    },
  },
  {
    url: '/basic-api/cinema/hall/list',
    timeout: 1000,
    method: 'get',
    response: () => {
      return resultSuccess(HallList);
    },
  },
  {
    url: '/basic-api/cinema/session/list',
    timeout: 1000,
    method: 'get',
    response: () => {
      return resultSuccess(SessionList);
    },
  },
  {
    url: '/basic-api/movie/list',
    timeout: 1000,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, MovieList);
    },
  },
  {
    url: '/basic-api/movie/detail',
    method: 'get',
    response: () => {
      return resultSuccess(MovieDetail);
    },
  },
  {
    url: '/basic-api/actor/list',
    timeout: 1000,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, ActorList);
    },
  },
] as MockMethod[];
