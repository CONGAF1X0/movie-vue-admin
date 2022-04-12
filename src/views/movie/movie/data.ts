import { getMovieList } from '/@/api/demo/movie';
import { ref } from 'vue';

export const cardList = (() => {
  const result: any[] = [];
  for (let i = 0; i < 12; i++) {
    result.push({
      title: 'Vben Admin',
      icon: 'logos:vue',
      color: '#1890ff',
      active: '100',
      new: '1,799',
      download: 'bx:bx-download',
    });
  }
  return result;
})();
export const query = ref('');
export const list = ref<any>([]);
export const loading = ref(false);
export const show = ref(false);
let page = 1;
const page_size = 20;
export const getList = async () => {
  loading.value = true;
  const data = await getMovieList({ query: query.value, page: page, page_size: page_size });
  if (data.code !== 200) {
  } else {
    list.value.push(...data.list);
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
  list.value = [];
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
