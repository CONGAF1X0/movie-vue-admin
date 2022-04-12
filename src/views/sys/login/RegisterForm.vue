<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem name="account" class="enter-x">
        <Input
          class="fix-auto-fill"
          size="large"
          v-model:value="formData.account"
          :placeholder="t('sys.login.userName')"
        />
      </FormItem>
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
      <FormItem name="password" class="enter-x">
        <StrengthMeter
          size="large"
          v-model:value="formData.password"
          :placeholder="t('sys.login.password')"
        />
      </FormItem>
      <FormItem name="confirmPassword" class="enter-x">
        <InputPassword
          size="large"
          visibilityToggle
          v-model:value="formData.confirmPassword"
          :placeholder="t('sys.login.confirmPassword')"
        />
      </FormItem>

      <FormItem class="enter-x" name="policy">
        <!-- No logic, you need to deal with it yourself -->
        <Checkbox v-model:checked="formData.policy" size="small">
          {{ t('sys.login.policy') }}
        </Checkbox>
      </FormItem>

      <Button
        type="primary"
        class="enter-x"
        size="large"
        block
        @click="handleRegister"
        :loading="loading"
      >
        {{ t('sys.login.registerButton') }}
      </Button>
      <Button size="large" block class="mt-4 enter-x" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </Button>
    </Form>
  </template>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { Form, Input, Button, Checkbox } from 'ant-design-vue';
  import { StrengthMeter } from '/@/components/StrengthMeter';
  import { CountdownInput } from '/@/components/CountDown';
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    useLoginState,
    useFormRules,
    useFormValid,
    LoginStateEnum,
    checkMobile,
    existChinese,
  } from './useLogin';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getMobileCaptcha, signup } from '/@/api/sys/user';

  const { createMessage } = useMessage();

  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();

  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    account: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    sms: '',
    policy: false,
  });

  const { getFormRules } = useFormRules(formData);
  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.REGISTER);

  async function handleRegister() {
    const data = await validForm();
    if (!data) return;
    if (existChinese(data.password + data.account)) {
      createMessage.error('请输入正确的账号密码');
      return;
    }
    try {
      loading.value = true;
      const res = await signup({
        username: data.account,
        password: data.password,
        mobile: data.mobile,
        captcha: data.sms,
      });
      if (res.code !== 200) {
        createMessage.error(res.msg);
        return;
      }
      createMessage.success('注册成功');
      handleBackLogin();
    } catch (error) {
      createMessage.error('注册失败');
    } finally {
      loading.value = false;
    }
    console.log(data);
    // handleBackLogin();
  }

  const getCode = async () => {
    if (!checkMobile(formData.mobile)) {
      createMessage.error('请输入正确的手机号');
      return false;
    }
    const res = await getMobileCaptcha(formData.mobile, 'signup');
    if (res.code === 1008) {
      createMessage.error('手机号已注册');
      return false;
    } else if (res.code !== 200) {
      createMessage.error('发送验证码失败');
      return false;
    }
    createMessage.success('验证码已发送');
    return true;
  };
</script>
