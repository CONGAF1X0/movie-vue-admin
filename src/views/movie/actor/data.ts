import { getActorList } from '/@/api/demo/movie';
import { ref } from 'vue';

// export const cardList = (() => {
//   const result: any[] = [];
//   for (let i = 0; i < 12; i++) {
//     result.push({
//       title: 'Vben Admin',
//       icon: 'logos:vue',
//       color: '#1890ff',
//       active: '100',
//       new: '1,799',
//       download: 'bx:bx-download',
//     });
//   }
//   return result;
// })();
export const query = ref('');
export const actorList = ref<any>([]);
export const loading = ref(false);
export const show = ref(false);
let page = 1;
const page_size = 20;
export const getList = async () => {
  loading.value = true;
  const data = await getActorList({ query: query.value, page: page, page_size: page_size });
  if (data.code !== 200) {
  } else {
    actorList.value.push(...data.list);
    page++;
  }
  if (data.list.length === 0) {
    show.value = true;
  } else {
    show.value = false;
  }
  loading.value = false;
};
getList();
export const resetList = () => {
  actorList.value = [];
  page = 1;
};
import { FormSchema } from '/@/components/Table';

export const Form: FormSchema[] = [
  {
    label: '此时间后',
    field: 't',
    component: 'DatePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
    },
    colProps: { span: 8 },
  },
];

export const actorFormSchema: FormSchema[] = [
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
    label: '',
    field: 'actor_id',
    component: 'InputNumber',
    show: false,
  },
  {
    label: '中文名',
    field: 'name1',
    component: 'Input',
    required: true,
  },
  {
    label: '名称2',
    field: 'name2',
    component: 'Input',
    required: true,
  },
  {
    label: '生日',
    field: 'birthday',
    component: 'DatePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
    },
    required: true,
  },
  {
    label: '简介',
    field: 'introduction',
    component: 'InputTextArea',
    componentProps: {
      autoSize: { minRows: 2, maxRows: 5 },
    },
    required: true,
  },
  {
    label: '头像',
    field: 'avatar',
    component: 'Input',
    required: true,
  },
];
