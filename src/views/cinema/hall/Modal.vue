<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { hallFormSchema, cinema_id } from './data';
  import { createHall, updateHall } from '/@/api/demo/cinema';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref();
      const { createMessage } = useMessage();
      const [registerForm, { setFieldsValue, updateSchema, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: hallFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          rowId.value = data.record.hall_id;
          let capArr = data.record.capacity.split('x');
          setFieldsValue({
            ...data.record,
            row: capArr[0],
            col: capArr[1],
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增放映厅' : '编辑放映厅'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          // TODO custom api
          console.log(values);
          if (isUpdate.value) {
            const res = await updateHall({
              hall_id: values.hall_id,
              cinema_id: cinema_id,
              hall_name: values.hall_name,
              capacity: values.row + 'x' + values.col,
            });
            if (res.code !== 200) {
              createMessage.error('更新失败');
              return;
            }
            emit('success', {
              isUpdate: unref(isUpdate),
              values: { ...values, hall_id: rowId.value, capacity: values.row + 'x' + values.col },
            });
          } else {
            const res = await createHall({
              cinema_id: cinema_id,
              hall_name: values.hall_name,
              capacity: values.row + 'x' + values.col,
            });
            if (res.code !== 201) {
              createMessage.error('创建失败');
              return;
            }
            emit('success', {
              isUpdate: unref(isUpdate),
            });
          }
          closeModal();
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit };
    },
  });
</script>
