/*
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2021-08-28 13:20:32
 * @LastEditors: ydfk
 * @LastEditTime: 2021-08-28 17:01:15
 */

import { BaseModel } from ".";

export interface UserModel extends BaseModel {
  userName: string;
  password: string;
}

/**
 * token
 */
export interface TokenModel {
  token: string;
  tokenExpiration: number;
}
