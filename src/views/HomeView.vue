<script setup lang="ts">
import { isArrayOf, isCategory, type Category } from '@/utils/types';
import { computedAsync } from '@vueuse/core';
import { PageLayout, FlexCard, HeaderText, SwitchDark } from '@yyhhenry/element-extra';
import { safelyAsync, ok, err, type Result, anyhow } from '@yyhhenry/rust-result';
import { ElButton } from 'element-plus';

const categories = computedAsync(async (): Promise<Result<Category[], Error>> => {
  const url = new URL('/api/categories', location.href);
  console.log('url', url);
  const data = await safelyAsync<unknown>(async () => await (await fetch(url)).json());
  if (data.isErr()) return err(data.unwrapErr());
  const categories = data.unwrap();
  if (!isArrayOf(categories, isCategory)) throw new Error('Invalid data');
  return ok(categories);
}, anyhow('Loading categories...'));
</script>

<template>
  <PageLayout>
    <template #header>
      <HeaderText>Home</HeaderText>
    </template>
    <template #header-extra>
      <SwitchDark></SwitchDark>
    </template>
    <FlexCard>
      <p> 以下是所有分类： </p>
      <div v-if="categories.isOk()" :style="{ margin: '15px' }">
        <ElButton v-for="category of categories.unwrap()" :key="category.id">
          #{{ category.id }} {{ category.name }}
        </ElButton>
      </div>
      <div v-else>
        <p>{{ categories.unwrapErr().message }}</p>
      </div>
    </FlexCard>

  </PageLayout>
</template>
