<template>
  <CollapseContainer title="影院信息" :canExpan="false">
    <a-row :gutter="24" type="flex" justify="center">
      <a-col :xs="22" :sm="20" :md="20" :lg="12" :xl="12">
        <BasicForm @register="register" />
        <a-col :offset="15">
          <Button type="primary" @click="handleSubmit">
            <span v-if="isCreate">创建影院</span>
            <span v-else>更新信息</span>
          </Button>
        </a-col>
      </a-col>
      <a-col :xs="22" :sm="20" :md="20" :lg="12" :xl="12">
        <Amap height="50vh" @back="backinfo" :fn="getFieldsValue" />
      </a-col>
    </a-row>
  </CollapseContainer>
</template>
<script lang="ts">
  import { Button, Row, Col } from 'ant-design-vue';
  import { computed, defineComponent, onMounted, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { CollapseContainer } from '/@/components/Container';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { updateCinemaInfo, createCinema } from '/@/api/demo/cinema';
  import headerImg from '/@/assets/images/header.jpg';
  import { baseSetschemas, cinfo, getCInfo, setCInfo, isCreate, userStore } from './data';
  // import { useUserStore } from '/@/store/modules/user';
  // import { useCinemaStore } from '/@/store/modules/cinema';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { uploadApi } from '/@/api/sys/upload';
  import Amap from './amap.vue';

  export default defineComponent({
    components: {
      BasicForm,
      CollapseContainer,
      Button,
      ARow: Row,
      ACol: Col,
      Amap,
    },
    setup() {
      const { refreshPage } = useTabs();
      const { createMessage } = useMessage();
      const [register, { setFieldsValue, validate, getFieldsValue }] = useForm({
        labelWidth: 120,
        schemas: baseSetschemas,
        showActionButtonGroup: false,
      });
      onMounted(() => {
        if (isCreate.value) {
          createMessage.info('请先绑定影院');
        }
      });
      function backinfo(data) {
        setFieldsValue(data);
      }
      const handleSubmit = async () => {
        try {
          await validate();
          setCInfo(getFieldsValue());
          if (!isCreate.value) {
            const res = await updateCinemaInfo(cinfo.value);
            if (res.code !== 200) {
              createMessage.error('更新失败！');
              return;
            }
            createMessage.success('更新成功！');
          } else {
            // console.log('create', cinfo.value);
            const res = await createCinema(cinfo.value);
            if (res.code !== 200) {
              createMessage.error('创建失败!');
              return;
            }
            isCreate.value = false;
            userStore.getUserInfoAction();
            createMessage.success('success!');
            refreshPage();
          }
        } catch (e) {}
      };
      return {
        register,
        uploadApi: uploadApi as any,
        backinfo,
        handleSubmit,
        cinfo,
        isCreate,
        getFieldsValue,
      };
    },
  });
</script>

<style lang="less" scoped>
  .change-avatar {
    img {
      display: block;
      margin-bottom: 15px;
      border-radius: 50%;
    }
  }
</style>
