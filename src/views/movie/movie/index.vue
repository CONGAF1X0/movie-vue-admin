<template>
  <PageWrapper :class="prefixCls">
    <template #title>
      <a-input-search
        v-model:value="query"
        placeholder="输入电影名搜索"
        style="width: 300px"
        enter-button="Search"
        allow-clear
        @search="onSearch"
      />
    </template>
    <template #extra>
      <a-button type="primary" @click="handleAdd"> NEW </a-button>
    </template>
    <div :class="`${prefixCls}__content`">
      <a-list :loading="loading">
        <a-row :gutter="16">
          <template v-for="item in list" :key="item.movie_id">
            <a-col :xs="12" :sm="8" :md="8" :lg="6" :xl="4">
              <a-list-item @click="handleView(item)">
                <a-card :hoverable="true" :class="`${prefixCls}__card`" size="small">
                  <template #cover>
                    <img :src="'https://images.weserv.nl/?url=' + item.cover" />
                  </template>
                  <div :class="`${prefixCls}__card-title`">
                    {{ item.movie_name }}
                  </div>
                  <div :class="`${prefixCls}__card-detail`">
                    {{ item.genre }}
                  </div>
                </a-card>
              </a-list-item>
            </a-col>
          </template>
        </a-row>
        <template #loadMore>
          <div
            :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
          >
            <a-spin v-if="loading" />
            <a-button v-else-if="show">no more</a-button>
            <a-button v-else @click="getList">loading more</a-button>
          </div>
        </template>
      </a-list>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Card, List, Row, Col, Image, Spin } from 'ant-design-vue';
  import Icon from '/@/components/Icon/index';
  import { PageWrapper } from '/@/components/Page';
  import { useGo } from '/@/hooks/web/usePage';
  import { loading, getList, list, resetList, query, show } from './data';
  export default defineComponent({
    components: {
      Icon,
      PageWrapper,
      [Card.name]: Card,
      [Card.Meta.name]: Card,
      [List.name]: List,
      [List.Item.name]: List.Item,
      [Row.name]: Row,
      [Col.name]: Col,
      [Image.name]: Image,
      [Spin.name]: Spin,
    },
    setup() {
      const go = useGo();

      const onSearch = () => {
        resetList();
        getList();
      };

      function handleView(record: Recordable) {
        go('/movie/movie_detail/' + record.movie_id);
      }
      function handleAdd() {
        go('/movie/movie_detail/add');
      }
      return {
        prefixCls: 'list-card',
        loading,
        list,
        query,
        onSearch,
        getList,
        handleView,
        handleAdd,
        show,
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
