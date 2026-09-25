<template>
  <section>
    <div class="toolbar">
      <el-select v-model="filters.reagentId" placeholder="全部试剂" clearable style="width: 180px" @change="applyFilters">
        <el-option v-for="reagent in reagentStore.items" :key="reagent.id" :label="reagent.name" :value="reagent.id" />
      </el-select>
      <el-select v-model="filters.userId" placeholder="全部领用人" clearable style="width: 160px" @change="applyFilters">
        <el-option v-for="user in users" :key="user.id" :label="user.name" :value="user.id" />
      </el-select>
      <el-select v-model="filters.status" placeholder="全部状态" clearable style="width: 140px" @change="applyFilters">
        <el-option v-for="option in USAGE_STATUS_OPTIONS" :key="option.value" :label="option.label" :value="option.value" />
      </el-select>
      <el-button type="primary" @click="openDialog">创建领用单</el-button>
    </div>

    <el-table v-if="paged.total" :data="paged.pageItems">
      <el-table-column label="试剂" min-width="200">
        <template #default="{ row }">
          <div>{{ reagentOf(row)?.name ?? row.reagentId }}</div>
          <small>可用 {{ availableOf(row) }}{{ unitOf(row) }} · 冻结 {{ reagentOf(row)?.frozenStock ?? 0 }}{{ unitOf(row) }}</small>
        </template>
      </el-table-column>
      <el-table-column label="领用数量" width="110">
        <template #default="{ row }">{{ row.quantity }}{{ unitOf(row) }}</template>
      </el-table-column>
      <el-table-column label="领用人" width="100">
        <template #default="{ row }">{{ userName(row.userId) }}</template>
      </el-table-column>
      <el-table-column label="关联实验" min-width="220">
        <template #default="{ row }">
          <div>{{ experimentOf(row)?.title ?? row.experimentId }}</div>
          <StatusBadge
            v-if="experimentOf(row)"
            :value="experimentOf(row)!.reviewStatus"
            :label="REVIEW_STATUS_LABELS[experimentOf(row)!.reviewStatus]"
          />
        </template>
      </el-table-column>
      <el-table-column label="领用状态" width="110">
        <template #default="{ row }">
          <StatusBadge :value="row.status" :label="usageStatusLabel(row.status)" />
        </template>
      </el-table-column>
      <el-table-column prop="purpose" label="用途说明" min-width="140" />
      <el-table-column prop="usedAt" label="领用日期" width="120" />
    </el-table>
    <EmptyState v-else description="暂无领用筛选结果" />
    <el-pagination
      v-if="paged.total > paged.pageSize"
      layout="prev, pager, next"
      :total="paged.total"
      :page-size="paged.pageSize"
      :current-page="page"
      @current-change="(value: number) => (page = value)"
    />

    <el-dialog v-model="dialogVisible" title="创建领用单" width="480px">
      <el-form label-width="90px">
        <el-form-item label="试剂">
          <el-select v-model="form.reagentId" placeholder="选择试剂" style="width: 100%">
            <el-option
              v-for="reagent in reagentStore.items"
              :key="reagent.id"
              :label="`${reagent.name}（可用 ${available(reagent)}${reagent.unit} / 冻结 ${reagent.frozenStock}${reagent.unit}）`"
              :value="reagent.id"
              :disabled="available(reagent) <= 0"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关联实验">
          <el-select v-model="form.experimentId" placeholder="仅已提交或要求修改的实验可领取" style="width: 100%">
            <el-option
              v-for="experiment in claimableExperiments"
              :key="experiment.id"
              :label="`${experiment.title}（${REVIEW_STATUS_LABELS[experiment.reviewStatus]}）`"
              :value="experiment.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="领用数量">
          <el-input-number v-model="form.quantity" :min="0.5" :max="maxQuantity" :step="0.5" />
          <span v-if="selectedReagent" style="margin-left: 8px">{{ selectedReagent.unit }}</span>
        </el-form-item>
        <el-form-item label="用途说明">
          <el-input v-model="form.purpose" placeholder="实验消耗" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submit">提交</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import EmptyState from "../components/common/EmptyState.vue";
import StatusBadge from "../components/common/StatusBadge.vue";
import { memberApi } from "../api/member";
import { REVIEW_STATUS_LABELS, USAGE_STATUS_LABELS, USAGE_STATUS_OPTIONS } from "../constants/statusLabels";
import { useExperimentStore } from "../stores/experimentStore";
import { useReagentStore } from "../stores/reagentStore";
import { usePagination } from "../hooks/usePagination";
import type { User } from "../types/member";
import type { Reagent, ReagentUsage } from "../types/reagent";

const reagentStore = useReagentStore();
const experimentStore = useExperimentStore();

const users = ref<User[]>([]);
const filters = reactive({ reagentId: "", userId: "", status: "" });
const page = ref(1);
const dialogVisible = ref(false);
const submitting = ref(false);
const form = reactive({ reagentId: "", experimentId: "", quantity: 1, purpose: "实验消耗" });

// 仅已提交或要求修改的实验允许领取
const claimableExperiments = computed(() => experimentStore.items.filter((item) => ["Submitted", "RevisionRequired"].includes(item.reviewStatus)));
const paged = computed(() => usePagination(reagentStore.usages, page.value, 10));
const selectedReagent = computed(() => reagentStore.items.find((item) => item.id === form.reagentId));
const maxQuantity = computed(() => (selectedReagent.value ? available(selectedReagent.value) : 0));

const available = (reagent: Reagent) => reagent.stock - reagent.frozenStock;
const reagentOf = (usage: ReagentUsage) => reagentStore.items.find((item) => item.id === usage.reagentId);
const experimentOf = (usage: ReagentUsage) => experimentStore.items.find((item) => item.id === usage.experimentId);
const availableOf = (usage: ReagentUsage) => {
  const reagent = reagentOf(usage);
  return reagent ? available(reagent) : 0;
};
const unitOf = (usage: ReagentUsage) => reagentOf(usage)?.unit ?? "";
const userName = (userId: string) => users.value.find((user) => user.id === userId)?.name ?? userId;
const usageStatusLabel = (status: ReagentUsage["status"]) => USAGE_STATUS_LABELS[status];

async function applyFilters() {
  page.value = 1;
  await reagentStore.loadUsages({ ...filters });
}

function openDialog() {
  if (!claimableExperiments.value.length) {
    ElMessage.warning("暂无已提交或要求修改的实验，无法创建领用单");
    return;
  }
  dialogVisible.value = true;
}

async function submit() {
  if (!form.reagentId || !form.experimentId) {
    ElMessage.warning("请选择试剂和关联实验");
    return;
  }
  submitting.value = true;
  try {
    await reagentStore.createUsage({ ...form });
    ElMessage.success("领用单已提交，库存已冻结，等待实验审核");
    dialogVisible.value = false;
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "创建领用单失败");
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  const [, , , members] = await Promise.all([reagentStore.load(), reagentStore.loadUsages({ ...filters }), experimentStore.load(), memberApi.list()]);
  users.value = members.flatMap((member) => (member.user ? [member.user] : [])).filter((user, index, list) => list.findIndex((item) => item.id === user.id) === index);
});
</script>
