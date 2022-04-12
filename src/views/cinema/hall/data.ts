import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { useUserStore } from '/@/store/modules/user';

export const userStore = useUserStore();
export const { cinema_id } = userStore.getUserInfo;

export const columns: BasicColumn[] = [
  {
    title: '放映厅名称',
    dataIndex: 'hall_name',
  },
  {
    title: '放映厅容量',
    dataIndex: 'capacity',
    width: 120,
  },
];

export const hallFormSchema: FormSchema[] = [
  { field: 'hall_id', label: '', component: 'InputNumber', show: false },
  { field: 'cinema_id', label: '', component: 'InputNumber', show: false },
  {
    field: 'hall_name',
    label: '放映厅名称',
    component: 'Input',
    rules: [
      {
        required: true,
      },
      // {
      //   validator(_, value) {
      //     return new Promise((resolve, reject) => {
      //       isAccountExist(value)
      //         .then(() => resolve())
      //         .catch((err) => {
      //           reject(err.message || '验证失败');
      //         });
      //     });
      //   },
      // },
    ],
  },
  {
    field: 'row',
    component: 'InputNumber',
    label: '排',
    required: true,
    defaultValue: 1,
    componentProps: {
      min: 1,
      max: 100,
    },
    colProps: {
      span: 8,
    },
  },
  {
    field: 'col',
    component: 'InputNumber',
    label: '列',
    required: true,
    defaultValue: 1,
    componentProps: {
      min: 1,
      max: 100,
    },
    colProps: {
      span: 8,
    },
  },
];
