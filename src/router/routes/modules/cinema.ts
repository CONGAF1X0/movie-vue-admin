import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const cinema: AppRouteModule = {
  path: '/cinema',
  name: 'Cinema',
  component: LAYOUT,
  redirect: '/cinema/info',
  meta: {
    orderNo: 11,
    icon: 'fluent:home-16-regular',
    title: t('routes.cinema.cinema'),
  },
  children: [
    {
      path: 'info',
      name: 'Info',
      component: () => import('/@/views/cinema/info/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.cinema.info'),
      },
    },
    {
      path: 'hall',
      name: 'Hall',
      component: () => import('/@/views/cinema/hall/index.vue'),
      meta: {
        title: t('routes.cinema.hall'),
      },
    },
    {
      path: 'session',
      name: 'Session',
      component: () => import('/@/views/cinema/session/index.vue'),
      meta: {
        title: t('routes.cinema.session'),
      },
    },
  ],
};

export default cinema;
