import { anyhow, err, ok, type Result } from "@yyhhenry/rust-result";
import { isArrayOf, isPartialUnknown } from "./types";
import { post, get } from '@/utils/fetch';

export interface User {
    name: string;
    password: string;
}
export const isUser = (value: unknown): value is User =>
    isPartialUnknown<User>(value) && typeof value.name === 'string' && typeof value.password === 'string';
export interface UserExistsResponse {
    exists: boolean;
}
export const isUserExistsResponse = (value: unknown): value is UserExistsResponse =>
    isPartialUnknown<UserExistsResponse>(value) && typeof value.exists === 'boolean';



export const userExists = async (name: string): Promise<Result<boolean, Error>> => {
    const response = await post('/api/user_exists', { name });
    if (response.isErr()) {
        return err(response.unwrapErr());
    }
    const userExists = response.unwrap();
    if (!isUserExistsResponse(userExists)) {
        return anyhow('/api/user_exists 返回结果异常');
    }
    return ok(userExists.exists);
};

export interface Category {
    name: string;
}
export const isCategory = (value: unknown): value is Category =>
    isPartialUnknown<Category>(value) && typeof value.name === 'string';

export const getCategories = async (): Promise<Result<Category[], Error>> => {
    const response = await get('/api/categories');
    if (response.isErr()) {
        return err(response.unwrapErr());
    }
    const categories = response.unwrap();
    if (!isArrayOf(categories, isCategory)) {
        return anyhow('/api/categories 返回结果异常');
    }
    return ok(categories);
};
