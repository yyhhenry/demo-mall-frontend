<script setup lang="ts">
import { userExists } from '@/utils/model';
import { computedAsync, useDebounce } from '@vueuse/core';
import { PageLayout, FlexCard, HeaderText, SwitchDark } from '@yyhhenry/element-extra';
import { ok, err, type Result, anyhow } from '@yyhhenry/rust-result';
import { ElButton, ElInput } from 'element-plus';
import { ref } from 'vue';
import { ArrowLeftBold } from '@element-plus/icons-vue';

const username = ref('');
const password = ref('');
const debouncedUsername = useDebounce(username, 300, { maxWait: 2000 });
const usernameInfo = computedAsync<Result<[], Error>>(async () => {
  const name = debouncedUsername.value;
  if (name === '') {
    return anyhow('');
  }
  if (name.length > 32) {
    return anyhow('用户名长度不能超过 32 个字符');
  }
  const isUserExists = await userExists(name);
  if (isUserExists.isErr()) {
    return err(isUserExists.unwrapErr());
  }
  if (isUserExists.unwrap()) {
    return anyhow(`用户名${name}已存在`);
  }
  return ok([]);
}, ok([]));
</script>

<template>
  <PageLayout>
    <template #header>
      <HeaderText>
        <ElButton :type="'danger'" :icon="ArrowLeftBold" @click="$router.push('/')"></ElButton>
      </HeaderText>
      <HeaderText>Register</HeaderText>
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
        <ElInput type="password" v-model="password" placeholder="密码" :style="{ marginBottom: '15px' }"></ElInput>

        <ElButton type="primary">注册</ElButton>
      </div>
    </FlexCard>

  </PageLayout>
</template>
