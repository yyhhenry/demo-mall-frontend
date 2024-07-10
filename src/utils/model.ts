import { type Result, anyhow, err, ok } from '@yyhhenry/rust-result';
import { isArrayOf, isPartialUnknown } from './types';
import { get, post } from '@/utils/fetch';

export interface User {
  name: string;
  password: string;
}
export function isUser(value: unknown): value is User {
  return (
    isPartialUnknown<User>(value) &&
    typeof value.name === 'string' &&
    typeof value.password === 'string'
  );
}
export interface UserExistsResponse {
  exists: boolean;
}
export function isUserExistsResponse(value: unknown): value is UserExistsResponse {
  return (
    isPartialUnknown<UserExistsResponse>(value) &&
    typeof value.exists === 'boolean'
  );
}

export async function userExistsApi(name: string): Promise<Result<boolean, Error>> {
  const response = await post('/api/user/exists', { name });
  if (response.isErr()) {
    return err(response.unwrapErr());
  }
  const userExists = response.unwrap();
  if (!isUserExistsResponse(userExists)) {
    return anyhow('/api/user/exists 返回结果异常');
  }
  return ok(userExists.exists);
}

export async function registerApi(user: User): Promise<Result<void, Error>> {
  const response = await post('/api/user/register', user);
  if (response.isErr()) {
    return err(response.unwrapErr());
  }
  return ok(undefined);
}

export interface Category {
  id: number;
  name: string;
}
export function isCategory(value: unknown): value is Category {
  return (
    isPartialUnknown<Category>(value) &&
    typeof value.id === 'number' &&
    typeof value.name === 'string'
  );
}

export async function getCategoriesApi(): Promise<Result<Category[], Error>> {
  const response = await get('/api/category/all');
  if (response.isErr()) {
    return err(response.unwrapErr());
  }
  const categories = response.unwrap();
  if (!isArrayOf(categories, isCategory)) {
    return anyhow('/api/category/all 返回结果异常');
  }
  return ok(categories);
}
