import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { getMovieList, getMovieRuntime } from '/@/api/demo/movie';
import { getHallList } from '/@/api/demo/cinema';
import moment from 'moment';
import { useUserStore } from '/@/store/modules/user';

export const userStore = useUserStore();
const { cinema_id } = userStore.getUserInfo;

export const columns: BasicColumn[] = [
  {
    title: '电影',
    dataIndex: 'movie_name',
    width: 120,
  },
  {
    title: '放映厅',
    dataIndex: 'hall_name',
    width: 120,
  },
  {
    title: '开始时间',
    dataIndex: 'start_time',
    customRender: (t) => {
      if (t.record.start_time) {
        return moment(t.record.start_time).format('YYYY-MM-DD HH:mm');
      }
    },
    width: 120,
  },
  {
    title: '结束时间',
    dataIndex: 'end_time',
    customRender: (t) => {
      if (t.record.end_time) {
        return moment(t.record.end_time).format('YYYY-MM-DD HH:mm');
      }
    },
    width: 120,
  },
  {
    title: '价格',
    dataIndex: 'price',
    width: 70,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    label: '此时间后',
    field: 't',
    component: 'DatePicker',
    componentProps: {
      showTime: { display: true, format: 'HH:mm', defaultValue: moment('00:00', 'HH:mm') },
      format: 'YYYY-MM-DD HH:mm',
    },
    colProps: { span: 8 },
  },
];

export const sessionFormSchema: FormSchema[] = [
  // {
  //   field: 'movie',
  //   label: '用户名',
  //   component: 'Input',
  //   helpMessage: ['本字段演示异步验证', '不能输入带有admin的用户名'],
  //   rules: [
  //     {
  //       required: true,
  //       message: '请输入用户名',
  //     },
  //     // {
  //     //   validator(_, value) {
  //     //     return new Promise((resolve, reject) => {
  //     //       isAccountExist(value)
  //     //         .then(() => resolve())
  //     //         .catch((err) => {
  //     //           reject(err.message || '验证失败');
  //     //         });
  //     //     });
  //     //   },
  //     // },
  //   ],
  // },
  // {
  //   field: 'pwd',
  //   label: '密码',
  //   component: 'InputPassword',
  //   required: true,
  //   ifShow: false,
  // },
  {
    field: 'session_id',
    label: '',
    component: 'InputNumber',
    show: false,
  },
  {
    label: '电影',
    field: 'movie_id',
    component: 'ApiSelect',
    componentProps: ({ formModel }) => {
      return {
        api: async (params: any) => {
          const data = await getMovieList(params);
          return data.list;
        },
        labelField: 'movie_name',
        valueField: 'movie_id',
        showSearch: true,
        optionFilterProp: 'label',
        onChange: async (e) => {
          if (formModel.start_time) {
            await getMovieRuntime(e).then((res) => {
              let x = 0;
              if (res.code === 200) {
                x = res.runtime;
              }
              formModel.end_time = moment(formModel.start_time.valueOf() + 1000 * 60 * x).format(
                'YYYY-MM-DD HH:mm',
              );
            });
          }
        },
      };
    },
    required: true,
  },
  {
    label: '放映厅',
    field: 'hall_id',
    component: 'ApiSelect',
    componentProps: {
      api: async (params: any) => {
        params['cinema_id'] = cinema_id;
        const data = await getHallList(params);
        return data.list;
      },
      labelField: 'hall_name',
      valueField: 'hall_id',
      showSearch: true,
      optionFilterProp: 'label',
    },
    required: true,
  },

  {
    label: '开始时间',
    field: 'start_time',
    component: 'DatePicker',
    componentProps: ({ formModel }) => {
      return {
        showTime: { display: true, format: 'HH:mm', defaultValue: moment('00:00', 'HH:mm') },
        format: 'YYYY-MM-DD HH:mm',
        onOk: async (e) => {
          if (formModel.movie_id) {
            await getMovieRuntime(formModel.movie_id).then((res) => {
              let x = 0;
              if (res.code === 200) {
                x = res.runtime;
              }
              formModel.end_time = moment(e.valueOf() + 1000 * 60 * x).format('YYYY-MM-DD HH:mm');
            });
          }
        },
      };
    },
    required: true,
  },
  {
    label: '结束时间',
    field: 'end_time',
    component: 'DatePicker',
    defaultValue: null,
    componentProps: {
      disabled: true,
      showTime: { display: true, format: 'HH:mm' },
      format: 'YYYY-MM-DD HH:mm',
    },
    required: true,
  },
  {
    label: '价格',
    field: 'price',
    component: 'InputNumber',
    required: true,
    defaultValue: 0,
    componentProps: {
      min: 0,
    },
  },
];
