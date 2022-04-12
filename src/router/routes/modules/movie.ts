import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const movie: AppRouteModule = {
  path: '/movie',
  name: 'Movie',
  component: LAYOUT,
  redirect: '/movie/movie',
  meta: {
    orderNo: 10,
    icon: 'bx:movie-play',
    title: t('routes.movie.menu'),
  },
  children: [
    {
      path: 'movie',
      name: 'Movie',
      component: () => import('/@/views/movie/movie/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.movie.movie'),
        ignoreKeepAlive: false,
      },
    },
    {
      path: 'actor',
      name: 'Actor',
      component: () => import('/@/views/movie/actor/index.vue'),
      meta: {
        title: t('routes.movie.actor'),
      },
    },
    {
      path: 'movie_detail/:id',
      name: 'MovieDetail',
      meta: {
        hideMenu: true,
        title: t('routes.movie.movieDetail'),
        ignoreKeepAlive: true,
        showMenu: false,
        currentActiveMenu: '/movie/movie',
      },
      component: () => import('/@/views/movie/movie/MovieDetail.vue'),
    },
    {
      path: 'movie_detail/add',
      name: 'MovieAdd',
      meta: {
        hideMenu: true,
        title: t('routes.movie.add'),
        ignoreKeepAlive: true,
        showMenu: false,
        currentActiveMenu: '/movie/movie',
      },
      component: () => import('/@/views/movie/movie/MovieDetail.vue'),
    },
  ],
};

export default movie;
