<!--
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2021-08-29 19:46:00
 * @LastEditors: ydfk
 * @LastEditTime: 2021-09-13 21:26:09
-->
<template>
  <div class="w-full">
    <van-cell-group inset>
      <template #title>
        <div class="flex justify-between">
          <span class="m-text-gray block text-center">{{ accountGroupDay.dateOfDay }}</span>
          <span>
            <span class="m-text-gray" v-if="totalIncome > 0">收 {{ formatMoney(totalIncome) }}</span>
            <span class="m-text-gray ml-2" v-if="totalExpenditure != 0">支 {{ formatMoney(totalExpenditure) }}</span>
          </span>
        </div>
      </template>
      <van-swipe-cell v-for="(account, index) in accountGroupDay.accounts" :key="account.id" :name="account.id" :beforeClose="onBeforeClose">
        <div :class="index < accountGroupDay.accounts.length - 1 ? 'divide-y-reverse divide-y px-2' : 'px-2'">
          <div class="flex justify-between px-1 pt-1">
            <div>{{ account.category }}</div>
            <span :class="isIncome(account.type) ? 'text-green-500' : 'text-red-500'">{{ formatMoney(account.amount) }}</span>
          </div>
          <div
            ><span class="px-1 block text-gray-300 text-sm">{{ account.remark }}</span></div
          >
        </div>
        <template #left>
          <van-button class="h-full" square type="primary" text="修改" />
        </template>
        <template #right>
          <van-button class="h-full" square type="danger" text="删除" />
        </template>
      </van-swipe-cell>
    </van-cell-group>
    <van-popup v-model:show="showAdd" class="h-full" position="bottom" closeable :close-on-click-overlay="false" @close="onCloseModify">
      <AddAccount :id="modifyId" @save:success="onModifySuccess" />
    </van-popup>
  </div>
</template>
<script lang="ts" setup>
  import AddAccount from "./AddAcount.vue";
  import { AccountTypeEnum } from "@/enums/accountEnum";
  import { AccountGroupDayModel } from "@/models/account";
  import { PropType } from "vue";
  import { reduceAccountAmount } from "./common";
  import { formatMoney } from "@/utils/numberUtil";
  import { Dialog, Toast } from "vant";
  import { apiDeleteAccountById } from "@/apis/account";

  const props = defineProps({
    accountGroupDay: { type: Object as PropType<AccountGroupDayModel>, required: true },
  });

  const emits = defineEmits(["refresh"]);

  let showAdd = $ref(false);
  let modifyId = $ref("");

  let totalIncome = $computed(() => reduceAccountAmount(props.accountGroupDay.accounts, AccountTypeEnum.Income));
  let totalExpenditure = $computed(() => reduceAccountAmount(props.accountGroupDay.accounts, AccountTypeEnum.Expenditure));

  const isIncome = (type: AccountTypeEnum) => type == AccountTypeEnum.Income;

  const onCloseModify = () => {
    modifyId = "";
    showAdd = false;
  };

  const onModifySuccess = async () => {
    emits("refresh");
    showAdd = false;
  };

  const onBeforeClose = ({ name, position }) => {
    switch (position) {
      case "left":
        modifyId = name;
        showAdd = true;
      case "cell":
      case "outside":
        return true;
      case "right":
        return new Promise((resolve) => {
          Dialog.confirm({
            title: "确定删除吗？",
          }).then(async () => {
            Toast.loading("删除中......");
            if (await apiDeleteAccountById(name)) {
              emits("refresh");
              resolve(true);
              Toast.success("删除成功");
            } else {
              Toast.fail("删除失败");
            }
          });
        });
    }
  };
</script>
