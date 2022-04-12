<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">新增场次</a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          v-if="record.Session == undefined"
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <Modal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getSessionList } from '/@/api/demo/cinema';
  import { PageWrapper } from '/@/components/Page';

  import { useModal } from '/@/components/Modal';
  import Modal from './Modal.vue';

  import { columns, searchFormSchema } from './data';
  import { useGo } from '/@/hooks/web/usePage';
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'SessiontManagement',
    components: { BasicTable, PageWrapper, Modal, TableAction },
    setup() {
      const userStore = useUserStore();
      const { cinema_id } = userStore.getUserInfo;
      const go = useGo();
      if (cinema_id === 0) {
        go('/cinema/info');
      }
      const [registerModal, { openModal }] = useModal();
      const searchInfo = reactive<Recordable>({});
      const [registerTable, { reload, updateTableDataRecord }] = useTable({
        title: '场次列表',
        api: getSessionList,
        rowKey: function (row) {
          return row.movie_id + '' + row.session_id;
        },
        beforeFetch: function (data) {
          data['cinema_id'] = cinema_id;
          if (data.t) data.t = new Date(data.t).getTime();

          return data;
        },
        childrenColumnName: 'Session',
        pagination: false,
        showIndexColumn: false,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        expandRowByClick: true,
        handleSearchInfoFn(info) {
          if (info.t) {
            info.t = new Date(info.t).getTime();
          }
          return info;
        },

        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        console.log(record);
        openModal(true, {
          record,
          isUpdate: true,
        });
      }

      function handleDelete(record: Recordable) {
        console.log(record);
        reload();
      }

      function handleSuccess({ isUpdate, values }) {
        reload();
      }

      function handleView(record: Recordable) {
        // go('/system/account_detail/' + record.id);
        console.log(record);
      }

      return {
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleView,
        searchInfo,
      };
    },
  });
</script>
