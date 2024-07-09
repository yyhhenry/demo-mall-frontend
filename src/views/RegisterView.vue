<script setup lang="ts">
import { registerApi, userExistsApi } from '@/utils/model';
import { computedAsync, useDebounce } from '@vueuse/core';
import { PageLayout, FlexCard, HeaderText, SwitchDark } from '@yyhhenry/element-extra';
import { ok, err, type Result, anyhow } from '@yyhhenry/rust-result';
import { ElButton, ElInput, ElMessage } from 'element-plus';
import { ref } from 'vue';
import { ArrowLeftBold } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const debouncedUsername = useDebounce(username, 300, { maxWait: 2000 });
const debouncedPassword = useDebounce(password, 300, { maxWait: 2000 });
const checkUsername = async (name: string): Promise<Result<[], Error>> => {
  if (name === '') {
    return anyhow('用户名不能为空');
  }
  if (name.length > 32) {
    return anyhow('用户名长度不能超过 32 个字符');
  }
  const isUserExists = await userExistsApi(name);
  if (isUserExists.isErr()) {
    return err(isUserExists.unwrapErr());
  }
  if (isUserExists.unwrap()) {
    return anyhow(`用户名${name}已存在`);
  }
  return ok([]);
};
const checkPassword = (password: string): Result<[], Error> => {
  if (password === '') {
    return anyhow('密码不能为空');
  }
  if (password.length < 8) {
    return anyhow('密码长度不能小于 6 个字符');
  }
  if (password.length > 18) {
    return anyhow('密码长度不能超过 32 个字符');
  }
  return ok([]);
};
const usernameInfo = computedAsync<Result<[], Error>>(async () => {
  return checkUsername(debouncedUsername.value);
}, ok([]));
const passwordInfo = computedAsync<Result<[], Error>>(async () => {
  return checkPassword(debouncedPassword.value);
}, ok([]));
const register = async () => {
  const checkUsernameResult = await checkUsername(username.value);
  if (checkUsernameResult.isErr()) {
    ElMessage.error(checkUsernameResult.unwrapErr().message);
    return;
  }
  const checkPasswordResult = await checkPassword(password.value);
  if (checkPasswordResult.isErr()) {
    ElMessage.error(checkPasswordResult.unwrapErr().message);
    return;
  }

  const registerResponse = await registerApi({
    name: username.value,
    password: password.value,
  });
  if (registerResponse.isErr()) {
    ElMessage.error(registerResponse.unwrapErr().message);
    return;
  }
  ElMessage.success('注册成功');
  router.push('/');
};
</script>

<template>
  <PageLayout>
    <template #header>
      <HeaderText>
        <ElButton :type="'danger'" :icon="ArrowLeftBold" @click="$router.push('/')"></ElButton>
      </HeaderText>
      <HeaderText>注册</HeaderText>
    </template>
    <template #header-extra>
      <SwitchDark></SwitchDark>
    </template>
    <FlexCard>
      <div :style="{ margin: '25px' }">
        <ElInput v-model="username" placeholder="用户名" :style="{ marginBottom: '15px' }">
          <template #suffix>
            <p :style="{ color: 'var(--el-color-danger)' }" v-if="usernameInfo.isErr()">{{
              usernameInfo.unwrapErr().message }}
            </p>
          </template>
        </ElInput>
        <ElInput type="password" v-model="password" placeholder="密码" :style="{ marginBottom: '15px' }">
          <template #suffix>
            <p :style="{ color: 'var(--el-color-danger)' }" v-if="passwordInfo.isErr()">{{
              passwordInfo.unwrapErr().message }}
            </p>
          </template>
        </ElInput>

        <div :style="{ display: 'flex', 'justify-content': 'center' }">
          <ElButton type="primary" @click="register">注册</ElButton>
        </div>

      </div>
    </FlexCard>

  </PageLayout>
</template>
