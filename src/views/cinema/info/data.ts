import { FormSchema } from '/@/components/Form/index';
import { reactive, ref } from 'vue';
import { useUserStore } from '/@/store/modules/user';
import { getCinemaInfo } from '/@/api/demo/cinema';
import { useMessage } from '/@/hooks/web/useMessage';
import { CinemaInfoModel } from '/@/api/demo/model/cinemaModel';

export const userStore = useUserStore();
const { cinema_id } = userStore.getUserInfo;
export const isCreate = ref(false);
const { createMessage } = useMessage();

if (cinema_id === 0) {
  isCreate.value = true;
}
export const cinfo = ref<CinemaInfoModel>({
  cinema_id: 0,
  cinema_name: '',
  mobile: '',
  province: '',
  city: '',
  district: '',
  location: '',
  longitude: 0.0,
  latitude: 0.0,
});
export const getCInfo = async () => {
  const res = await getCinemaInfo({ cinema_id: cinema_id });
  if (res.code !== 200) {
  } else {
    cinfo.value = res.data;
    cinfo.value['address'] =
      cinfo.value.province + cinfo.value.city + cinfo.value.district + cinfo.value.location;
  }
};
export const setCInfo = (data) => {
  cinfo.value = data;
};
// tab的list
export const settingList = [
  {
    key: '1',
    name: '基本设置',
    component: 'BaseSetting',
  },
  {
    key: '2',
    name: '安全设置',
    component: 'SecureSetting',
  },
  {
    key: '3',
    name: '账号绑定',
    component: 'AccountBind',
  },
  {
    key: '4',
    name: '新消息通知',
    component: 'MsgNotify',
  },
];

// 基础设置 form
export const baseSetschemas: FormSchema[] = [
  { field: 'cinema_id', label: '', component: 'InputNumber', show: false },
  { field: 'province', label: '', component: 'Input', show: false },
  { field: 'city', label: '', component: 'Input', show: false },
  { field: 'district', label: '', component: 'Input', show: false },
  { field: 'location', label: '', component: 'Input', show: false },
  { field: 'longitude', label: '', component: 'InputNumber', show: false },
  { field: 'latitude', label: '', component: 'InputNumber', show: false },

  {
    field: 'cinema_name',
    component: 'Input',
    label: '影院名称',
    required: true,
    colProps: { span: 18 },
  },
  {
    field: 'mobile',
    component: 'Input',
    label: '联系电话',
    required: true,
    colProps: { span: 18 },
  },
  {
    field: 'address',
    component: 'Input',
    label: '地址',
    dynamicDisabled: true,
    required: true,

    colProps: { span: 18 },
  },
];

// 安全设置 list
export const secureSettingList: ListItem[] = [
  {
    key: '1',
    title: '账户密码',
    description: '当前密码强度：：强',
    extra: '修改',
  },
  {
    key: '2',
    title: '密保手机',
    description: '已绑定手机：：138****8293',
    extra: '修改',
  },
  {
    key: '3',
    title: '密保问题',
    description: '未设置密保问题，密保问题可有效保护账户安全',
    extra: '修改',
  },
  {
    key: '4',
    title: '备用邮箱',
    description: '已绑定邮箱：：ant***sign.com',
    extra: '修改',
  },
  {
    key: '5',
    title: 'MFA 设备',
    description: '未绑定 MFA 设备，绑定后，可以进行二次确认',
    extra: '修改',
  },
];

// 账号绑定 list
export const accountBindList: ListItem[] = [
  {
    key: '1',
    title: '绑定淘宝',
    description: '当前未绑定淘宝账号',
    extra: '绑定',
    avatar: 'ri:taobao-fill',
    color: '#ff4000',
  },
  {
    key: '2',
    title: '绑定支付宝',
    description: '当前未绑定支付宝账号',
    extra: '绑定',
    avatar: 'fa-brands:alipay',
    color: '#2eabff',
  },
  {
    key: '3',
    title: '绑定钉钉',
    description: '当前未绑定钉钉账号',
    extra: '绑定',
    avatar: 'ri:dingding-fill',
    color: '#2eabff',
  },
];

// 新消息通知 list
export const msgNotifyList: ListItem[] = [
  {
    key: '1',
    title: '账户密码',
    description: '其他用户的消息将以站内信的形式通知',
  },
  {
    key: '2',
    title: '系统消息',
    description: '系统消息将以站内信的形式通知',
  },
  {
    key: '3',
    title: '待办任务',
    description: '待办任务将以站内信的形式通知',
  },
];
