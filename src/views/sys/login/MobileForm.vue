<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem name="mobile" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.mobile"
          :placeholder="t('sys.login.mobile')"
          class="fix-auto-fill"
        />
      </FormItem>
      <FormItem name="sms" class="enter-x">
        <CountdownInput
          size="large"
          class="fix-auto-fill"
          v-model:value="formData.sms"
          :sendCodeApi="getCode"
          :placeholder="t('sys.login.smsCode')"
        />
      </FormItem>

      <FormItem class="enter-x">
        <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
          {{ t('sys.login.loginButton') }}
        </Button>
        <Button size="large" block class="mt-4" @click="handleBackLogin">
          {{ t('sys.login.backSignIn') }}
        </Button>
      </FormItem>
    </Form>
  </template>
</template>
<script lang="ts" setup>
  import { reactive, ref, computed, unref } from 'vue';
  import { Form, Input, Button } from 'ant-design-vue';
  import { CountdownInput } from '/@/components/CountDown';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    useLoginState,
    useFormRules,
    useFormValid,
    LoginStateEnum,
    checkMobile,
  } from './useLogin';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getMobileCaptcha } from '/@/api/sys/user';
  import { useUserStore } from '/@/store/modules/user';
  const { createMessage, notification } = useMessage();
  const FormItem = Form.Item;
  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);
  const userStore = useUserStore();
  const formData = reactive({
    mobile: '',
    sms: '',
  });

  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.MOBILE);

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    if (data.sms.length != 6) {
      createMessage.error('请输入正确的验证码');
      return;
    }
    try {
      loading.value = true;
      const userInfo = await userStore.loginByMobile(data.mobile, data.sms);
      console.log(userInfo);
      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.user_name}`,
          duration: 3,
        });
      }
    } catch (error) {
      createMessage.error('登陆失败：' + error);
    } finally {
      loading.value = false;
    }
  }

  const getCode = async () => {
    if (!checkMobile(formData.mobile)) {
      createMessage.error('请输入正确的手机号');
      return false;
    }
    const res = await getMobileCaptcha(formData.mobile, 'login');
    if (res.code === 1009) {
      createMessage.error('手机号未注册');
      return false;
    } else if (res.code !== 200) {
      createMessage.error('发送验证码失败');
      return false;
    }
    createMessage.success('验证码已发送');
    return true;
  };
</script>
