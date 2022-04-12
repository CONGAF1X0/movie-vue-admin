<template>
  <PageWrapper :class="prefixCls">
    <template #title>
      <a-input-search
        v-model:value="query"
        placeholder="输入演职员名称搜索"
        style="width: 300px"
        enter-button="Search"
        allow-clear
        @search="onSearch"
      />
    </template>
    <template #extra>
      <a-button type="primary" @click="handleCreate"
        ><Icon icon="ant-design:plus-outlined" />
      </a-button>
    </template>
    <div :class="`${prefixCls}__content`">
      <a-list
        class="demo-loadmore-list"
        item-layout="horizontal"
        :data-source="actorList"
        :loading="loading"
      >
        <template #loadMore>
          <div
            :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
          >
            <a-spin v-if="loading" />
            <a-button v-else-if="show">no more</a-button>
            <a-button v-else @click="getList">loading more</a-button>
          </div>
        </template>
        <template #renderItem="{ item }">
          <a-list-item>
            <template #actions>
              <a @click="handleEdit(item)"><Icon icon="ant-design:edit-outlined" /> Edit </a>
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
    </div>
    <Modal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Card, List, Row, Col, Image, Spin, Avatar, Popconfirm } from 'ant-design-vue';
  import Modal from './Modal.vue';
  import { useModal } from '/@/components/Modal';
  import { delActor } from '/@/api/demo/movie';
  import { message } from 'ant-design-vue';

  import Icon from '/@/components/Icon/index';
  import { PageWrapper } from '/@/components/Page';
  import { useGo } from '/@/hooks/web/usePage';
  import { loading, getList, actorList, resetList, query, show } from './data';
  export default defineComponent({
    components: {
      APopconfirm: Popconfirm,
      Icon,
      Modal,
      PageWrapper,
      [Card.name]: Card,
      [Card.Meta.name]: Card,
      AList: List,
      AListItem: List.Item,
      AAvatar: Avatar,
      [List.Item.Meta.name]: List.Item.Meta,
      [Row.name]: Row,
      [Col.name]: Col,
      [Image.name]: Image,
      [Spin.name]: Spin,
    },
    setup() {
      const go = useGo();
      const [registerModal, { openModal }] = useModal();

      const onSearch = () => {
        console.log(query);
        resetList();
        getList(query);
      };
      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        });
      }

      function handleEdit(item) {
        console.log(item);
        openModal(true, {
          item,
          isUpdate: true,
        });
      }

      async function handleDelete(item) {
        console.log(item);
        const res = await delActor({ actor_id: item.actor_id });
        if (res.code !== 200) {
          message.error('删除失败');
          return;
        }
        message.success('删除成功');
        onSearch();
      }

      function handleSuccess({ isUpdate, values }) {
        onSearch();
      }
      function handleView(record: Recordable) {
        go('/movie/movie_detail/' + record.movie_id);
      }
      return {
        prefixCls: 'list-card',
        loading,
        actorList,
        show,
        query,
        onSearch,
        getList,
        handleView,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        registerModal,
      };
    },
  });
</script>

<style lang="less" scoped>
  .list-card {
    &__link {
      margin-top: 10px;
      font-size: 14px;
    }

    &__card {
      width: 90%;
      margin-bottom: -8px;

      .ant-card-body {
        padding: 16px;
      }

      &-title {
        margin-bottom: 5px;
        font-size: 16px;
        font-weight: 500;
        color: @text-color;
        overflow: hidden; //超出一行文字自动隐藏
        text-overflow: ellipsis; //文字隐藏后添加省略号
        white-space: nowrap;
      }

      &-detail {
        padding-top: 10px;
        font-size: 14px;
        color: @text-color-secondary;
        overflow: hidden; //超出一行文字自动隐藏
        text-overflow: ellipsis; //文字隐藏后添加省略号
        white-space: nowrap;
      }
    }
  }
</style>
