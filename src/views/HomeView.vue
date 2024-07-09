<script setup lang="ts">
import { getCategoriesApi } from '@/utils/model';
import { computedAsync } from '@vueuse/core';
import { PageLayout, FlexCard, HeaderText, SwitchDark } from '@yyhhenry/element-extra';
import { anyhow } from '@yyhhenry/rust-result';
import { ElButton } from 'element-plus';

const categories = computedAsync(getCategoriesApi, anyhow('Loading categories...'));
</script>

<template>
  <PageLayout>
    <template #header>
      <HeaderText>首页</HeaderText>
    </template>
    <template #header-extra>
      <ElButton :type="'primary'" :style="{ margin: '15px' }" @click="$router.push('/register')">注册</ElButton>
      <SwitchDark></SwitchDark>
    </template>
    <FlexCard>
      <p> 以下是所有分类： </p>
      <div v-if="categories.isOk()" :style="{ margin: '15px' }">
        <ElButton v-for="category of categories.unwrap()" :key="category.name">
          {{ category.name }}
        </ElButton>
      </div>
      <div v-else>
        <p>{{ categories.unwrapErr().message }}</p>
      </div>
    </FlexCard>

  </PageLayout>
</template>
