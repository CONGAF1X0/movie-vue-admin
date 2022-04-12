<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">新增放映厅</a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑放映厅资料',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除此放映厅',
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
  import { getHallList } from '/@/api/demo/cinema';
  import { PageWrapper } from '/@/components/Page';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import Modal from './Modal.vue';

  import { columns, cinema_id } from './data';
  import { useGo } from '/@/hooks/web/usePage';

  export default defineComponent({
    name: 'HallManagement',
    components: { BasicTable, PageWrapper, Modal, TableAction },
    setup() {
      const go = useGo();
      if (cinema_id === 0) {
        go('/cinema/info');
      }
      const { createMessage } = useMessage();

      const [registerModal, { openModal }] = useModal();
      const [registerTable, { reload, updateTableDataRecord, deleteTableDataRecord }] = useTable({
        title: '放映厅列表',
        api: getHallList,
        beforeFetch: function (data) {
          data['cinema_id'] = cinema_id;
        },
        rowKey: 'hall_id',

        columns,
        useSearchForm: false,
        showTableSetting: true,
        pagination: false,
        bordered: true,
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
        deleteTableDataRecord(record.hall_id);
      }

      function handleSuccess({ isUpdate, values }) {
        if (isUpdate) {
          // 演示不刷新表格直接更新内部数据。
          // 注意：updateTableDataRecord要求表格的rowKey属性为string并且存在于每一行的record的keys中
          const result = updateTableDataRecord(values.hall_id, values);
          console.log(result);
        } else {
          reload();
        }
        createMessage.success('success');
      }

      function handleView(record: Recordable) {
        go('/system/account_detail/' + record.id);
      }

      return {
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleView,
      };
    },
  });
</script>
