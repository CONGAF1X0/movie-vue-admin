<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" style="min-height: 40vh" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { sessionFormSchema, userStore } from './data';
  import { message } from 'ant-design-vue';

  import moment from 'moment';
  import { updateSession, createSession, createSession } from '/@/api/demo/cinema';
  export default defineComponent({
    name: 'SessionModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');

      const [registerForm, { setFieldsValue, updateSchema, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: sessionFormSchema,
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
          rowId.value = data.record.id;
          setFieldsValue({
            ...data.record,
          });
        }

        updateSchema([
          {
            field: 'pwd',
            show: !unref(isUpdate),
          },
        ]);
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增场次' : '编辑场次'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          // TODO custom api
          values.start_time = moment(values.start_time).valueOf();
          values.end_time = moment(values.end_time).valueOf();
          values['cinema_id'] = userStore.getUserInfo.cinema_id;
          console.log(values);
          if (isUpdate.value) {
            const res = await updateSession(values);
            if (res.code !== 200) {
              console.log('failed');
              message.error('更新失败');
              return;
            }
            message.success('更新成功');
          } else {
            const res = await createSession(values);
            if (res.code !== 201) {
              console.log('failed');
              message.error('创建失败');
              return;
            }
            message.success('创建成功');
          }
          closeModal();
          emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit };
    },
  });
</script>
