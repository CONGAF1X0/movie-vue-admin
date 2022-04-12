<template>
  <PageWrapper contentBackground @back="goBack">
    <template #title>
      {{ data.movie_name }}
    </template>
    <template #extra>
      <a-button type="primary" danger v-show="!isAdd"> 删除电影 </a-button>
    </template>
    <template #footer>
      <a-tabs default-active-key="detail" v-model:activeKey="currentKey">
        <a-tab-pane key="detail" tab="详细" />
        <a-tab-pane key="logs" tab="演职员" />
      </a-tabs>
    </template>
    <div class="pt-4 m-4 desc-wrap">
      <template v-if="currentKey == 'detail'">
        <a-row>
          <a-col span="4">
            <a-image
              :width="260"
              :src="
                data.cover?.includes('douban')
                  ? 'https://images.weserv.nl/?url=' + data.cover
                  : data.cover
              "
              fallback="/resource/img/404.png"
            />
          </a-col>
          <a-col span="20">
            <a-form :labelCol="{ span: 3 }" :wrapperCol="{ span: 10 }" :model="data">
              <a-form-item label="电影名称" name="movie_name" :rules="[{ required: true }]">
                <a-input v-model:value="data.movie_name" name="movie_name" />
              </a-form-item>
              <a-form-item label="导演" name="director">
                <a-input v-model:value="data.director" name="director" />
              </a-form-item>
              <a-form-item label="类型" name="genre">
                <a-select
                  v-model:value="genre"
                  mode="multiple"
                  :open="open"
                  style="width: 100%"
                  dropdownMenuStyle="width:50%"
                  :options="items.map((item) => ({ value: item }))"
                  @focus="openFunc"
                  @blur="blurFunc"
                >
                  <template #dropdownRender="{ menuNode: menu }">
                    <v-nodes :vnodes="menu" />
                    <a-divider style="margin: 4px 0" />
                    <div
                      style="padding: 4px 8px; cursor: pointer"
                      @mousedown="(e) => e.preventDefault()"
                    >
                      <a-input
                        name="addinp"
                        v-model:value="it"
                        allow-clear
                        placeholder="自定义类型"
                        @click="openFunc"
                        @blur="openFunc"
                      >
                        <template #addonAfter>
                          <div @click="addItem">
                            <plus-outlined />
                          </div>
                        </template>
                      </a-input>
                    </div>
                  </template>
                </a-select>
              </a-form-item>
              <a-form-item label="上映日期" name="release" :rules="[{ required: true }]">
                <a-date-picker v-model:value="data.release" />
              </a-form-item>
              <a-form-item label="电影时长" name="runtime" :rules="[{ required: true }]">
                <a-input-number :min="0" v-model:value="data.runtime" /> 分钟
              </a-form-item>
              <a-form-item name="rate" label="评分">
                <a-rate v-model:value="rate" allow-half />
              </a-form-item>
              <a-form-item label=" 封面" name="cover" :rules="[{ required: true }]">
                <a-input v-model:value="data.cover">
                  <template #addonAfter>
                    <a-upload
                      :showUploadList="false"
                      name="file"
                      v-model:file-list="fileList"
                      :maxCount="1"
                      action="/upload?type=1"
                      @change="handleChange"
                    >
                      <div style="padding: 4px 8px; cursor: pointer">
                        <upload-outlined />
                      </div>
                    </a-upload>
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item label="简介" name="storyline">
                <a-textarea
                  v-model:value="data.storyline"
                  placeholder="textarea"
                  allow-clear
                  :auto-size="{ minRows: 2, maxRows: 6 }"
                />
              </a-form-item>
              <a-form-item :wrapper-col="{ offset: 3, span: 10 }">
                <a-button type="primary" @click="submit" html-type="submit">Submit</a-button>
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>
      </template>
      <template v-if="currentKey == 'logs'">
        <a-list class="demo-loadmore-list" item-layout="horizontal" :data-source="actorList">
          <template #loadMore>
            <div
              :style="{
                textAlign: 'center',
                marginTop: '12px',
                height: '32px',
                lineHeight: '32px',
              }"
            >
              <a-button @click="addActor"> <plus-outlined /> Add </a-button>
            </div>
          </template>
          <template #renderItem="{ item }">
            <a-list-item>
              <template #actions>
                <a-popconfirm
                  placement="topRight"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="handleDelete(item)"
                >
                  <template #title>
                    <p>确认是否删除？</p>
                  </template>
                  <a style="color: #faa19d"><Icon icon="ant-design:delete-outlined" />Delete</a>
                </a-popconfirm>
              </template>
              <a-list-item-meta>
                <template #title>
                  <a-row type="flex" justify="start">
                    <span>{{ item.name1 }}</span>
                    <span style="margin-left: 10px">{{ item.name2 }}</span>
                  </a-row>
                  <a-row>
                    {{ $moment(item.birthday).format('yyyy-MM-DD') }}
                  </a-row>
                </template>
                <template #avatar>
                  <a-avatar :src="'https://images.weserv.nl/?url=' + item.avatar" :size="64" />
                </template>

                <template #description>
                  <span
                    style="
                      display: inline-block;
                      white-space: nowrap;
                      overflow-x: hidden;
                      width: 80%;
                      text-overflow: ellipsis;
                    "
                  >
                    {{ item.introduction }}
                  </span>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </template>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { useRoute } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import Icon from '/@/components/Icon/index';

  import {
    Tabs,
    Row,
    Col,
    Image,
    Form,
    Rate,
    Input,
    DatePicker,
    InputNumber,
    Select,
    Upload,
    Divider,
    List,
    Avatar,
    Popconfirm,
  } from 'ant-design-vue';
  import { PlusOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import { getMovieDetail } from '/@/api/demo/movie';
  import type { UploadChangeParam } from 'ant-design-vue';
  import type { MovieDetailModel } from '/@/api/demo/model/movieModel';
  import moment from 'moment';

  export default defineComponent({
    name: 'MovieDetail',
    components: {
      Icon,
      PlusOutlined,
      UploadOutlined,
      ADivider: Divider,
      ADatePicker: DatePicker,
      VNodes: (_, { attrs }) => {
        return attrs.vnodes;
      },
      PageWrapper,
      DeleteOutlined,
      APopconfirm: Popconfirm,
      AList: List,
      AListItem: List.Item,
      [List.Item.Meta.name]: List.Item.Meta,
      ATabs: Tabs,
      ASelect: Select,
      ATabPane: Tabs.TabPane,
      ARow: Row,
      ACol: Col,
      AInput: Input,
      AImage: Image,
      AForm: Form,
      ARate: Rate,
      AAvatar: Avatar,
      [Form.Item.name]: Form.Item,
      AUpload: Upload,
      AInputNumber: InputNumber,
    },
    setup() {
      const route = useRoute();
      const go = useGo();
      // 此处可以得到用户ID
      const id = ref(route.params?.id);
      const isAdd = id.value == undefined;
      const currentKey = ref('detail');
      const { setTitle } = useTabs();
      // TODO
      // 本页代码仅作演示，实际应当通过userId从接口获得用户的相关资料
      const data = ref<any>({});
      const rate = ref(0);
      const items = ref<any>([]);
      const genre = ref<any>([]);
      const release = ref();
      const actorList = ref([]);
      async function getData() {
        const res = await getMovieDetail(id.value.toString());
        if (res.code !== 200) {
        } else {
          data.value = res.data;
          actorList.value = res.data.stars;
        }
      }

      // 设置Tab的标题（不会影响页面标题）
      onMounted(() => {
        if (!isAdd) {
          getData().then(() => {
            setTitle('电影：' + data.value.movie_name);
            rate.value = data.value.rating / 2;
            const genreArr = data.value.genre.split('/');
            items.value = genreArr;
            genre.value = genreArr;
            // release.value = moment(data.value.release).format('YYYY-MM-DD');
          });
        }
      });

      // 页面左侧点击返回链接时的操作
      function goBack() {
        // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
        go('/movie/movie');
      }

      const it = ref('');
      const open = ref(false);
      const addItem = () => {
        if (it.value != '' && !items.value.includes(it.value)) {
          items.value.push(it.value);
          genre.value.push(it.value);
          it.value = '';
        }
      };
      const openFunc = (e) => {
        if (e.target.name == 'addinp') {
          e.target.focus();
          if (e.type == 'blur') {
            open.value = false;
          }
        } else {
          open.value = !open.value;
        }

        // e.target.focus();
        // e.preventDefault();
      };
      const blurFunc = (e) => {
        if (e.relatedTarget == null || e.relatedTarget.name != 'addinp') {
          open.value = false;
        }
      };

      const handleChange = (info: UploadChangeParam) => {
        if (info.file.status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
          data.value.cover = info.file.response.file_access_url;
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      };

      const addActor = () => {
        actorList.value.push(1);
      };
      const fileList = ref([]);
      const submit = () => {
        let t = data.value.release.valueOf();
        console.log(data.value);
      };
      const handleDelete = (val) => {
        data.value.stars_ids = data.value.stars_ids.replace(
          data.value.stars.indexOf(val) == 0
            ? data.value.stars.length > 1
              ? val.actor_id + ','
              : val.actor_id
            : ',' + val.actor_id,
          '',
        );
        data.value.stars.splice(data.value.stars.indexOf(val), 1);
        console.log(data.value);
      };
      return {
        id,
        actorList,
        addActor,
        open,
        currentKey,
        goBack,
        data,
        rate,
        items,
        addItem,
        blurFunc,
        genre,
        it,
        openFunc,
        handleChange,
        handleDelete,
        isAdd,
        fileList,
        release,
        submit,
      };
    },
  });
</script>

<style></style>
