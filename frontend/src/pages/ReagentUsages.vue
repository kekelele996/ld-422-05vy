<template>
  <section>
    <h2>领用记录</h2>
    <div class="toolbar">
      <el-select v-model="filters.reagentId" placeholder="全部试剂" clearable style="width: 180px" @change="reload">
        <el-option v-for="reagent in reagentStore.items" :key="reagent.id" :label="reagent.name" :value="reagent.id" />
      </el-select>
      <el-select v-model="filters.userId" placeholder="全部领用人" clearable style="width: 160px" @change="reload">
        <el-option v-for="userId in userOptions" :key="userId" :label="userId" :value="userId" />
      </el-select>
      <el-select v-model="filters.status" placeholder="全部状态" clearable style="width: 160px" @change="reload">
        <el-option label="待审批" value="PendingApproval" />
        <el-option label="已领用" value="Received" />
        <el-option label="已取消" value="Cancelled" />
      </el-select>
      <el-button type="primary" @click="dialogVisible = true">创建领用单</el-button>
    </div>

    <el-table :data="reagentStore.usages" empty-text="暂无领用筛选结果">
      <el-table-column label="试剂" min-width="130">
        <template #default="{ row }">{{ reagentName(row.reagentId) }}</template>
      </el-table-column>
      <el-table-column prop="userId" label="领用人" width="110" />
      <el-table-column label="数量" width="90">
        <template #default="{ row }">{{ row.quantity }}{{ reagentUnit(row.reagentId) }}</template>
      </el-table-column>
      <el-table-column label="可用库存" width="100">
        <template #default="{ row }">{{ availableOf(row.reagentId) }}</template>
      </el-table-column>
      <el-table-column label="冻结" width="90">
        <template #default="{ row }">{{ frozenOf(row.reagentId) }}</template>
      </el-table-column>
      <el-table-column label="关联实验" min-width="200">
        <template #default="{ row }">
          <span>{{ experimentTitle(row.experimentId) }}</span>
          <StatusBadge v-if="experimentOf(row.experimentId)" :value="experimentOf(row.experimentId)!.reviewStatus" style="margin-left: 6px" />
        </template>
      </el-table-column>
      <el-table-column label="领用状态" width="110">
        <template #default="{ row }"><StatusBadge :value="row.status" /></template>
      </el-table-column>
      <el-table-column prop="purpose" label="用途" min-width="120" />
      <el-table-column prop="usedAt" label="领用日期" width="110" />
    </el-table>
    <EmptyState v-if="!reagentStore.usages.length" description="暂无领用筛选结果" />

    <el-dialog v-model="dialogVisible" title="创建领用单" width="480px">
      <el-form label-width="90px">
        <el-form-item label="试剂">
          <el-select v-model="form.reagentId" placeholder="选择试剂" style="width: 100%">
            <el-option
              v-for="reagent in reagentStore.items"
              :key="reagent.id"
              :label="`${reagent.name}（可用 ${availableOf(reagent.id)} / 冻结 ${reagent.frozenStock}${reagent.unit}）`"
              :value="reagent.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关联实验">
          <el-select v-model="form.experimentId" placeholder="仅已提交或要求修改的实验" style="width: 100%">
            <el-option v-for="experiment in claimableExperiments" :key="experiment.id" :label="`${experiment.title}（${experiment.reviewStatus}）`" :value="experiment.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="领用数量">
          <el-input-number v-model="form.quantity" :min="0.1" :precision="2" />
        </el-form-item>
        <el-form-item label="用途说明">
          <el-input v-model="form.purpose" placeholder="实验消耗" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submit">提交（提交后冻结库存）</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import StatusBadge from "../components/common/StatusBadge.vue";
import EmptyState from "../components/common/EmptyState.vue";
import { useReagentStore } from "../stores/reagentStore";
import { useExperimentStore } from "../stores/experimentStore";

const reagentStore = useReagentStore();
const experimentStore = useExperimentStore();

const filters = reactive({ reagentId: "", userId: "", status: "" });
const dialogVisible = ref(false);
const submitting = ref(false);
const form = reactive({ reagentId: "", experimentId: "", quantity: 1, purpose: "" });

const claimableExperiments = computed(() => experimentStore.items.filter((item) => ["Submitted", "RevisionRequired"].includes(item.reviewStatus)));
const userOptions = computed(() => [...new Set(reagentStore.usages.map((item) => item.userId))]);

const reagentOf = (id: string) => reagentStore.items.find((item) => item.id === id);
const experimentOf = (id: string) => experimentStore.items.find((item) => item.id === id);
const reagentName = (id: string) => reagentOf(id)?.name ?? id;
const reagentUnit = (id: string) => reagentOf(id)?.unit ?? "";
const experimentTitle = (id: string) => experimentOf(id)?.title ?? id;
const availableOf = (id: string) => {
  const reagent = reagentOf(id);
  return reagent ? `${reagent.availableStock ?? reagent.stock - reagent.frozenStock}${reagent.unit}` : "-";
};
const frozenOf = (id: string) => {
  const reagent = reagentOf(id);
  return reagent ? `${reagent.frozenStock}${reagent.unit}` : "-";
};

async function reload() {
  await reagentStore.loadUsages(filters.reagentId, filters.userId, filters.status);
}

async function submit() {
  if (!form.reagentId || !form.experimentId) {
    ElMessage.warning("请选择试剂和关联实验");
    return;
  }
  submitting.value = true;
  try {
    await reagentStore.createUsage({ reagentId: form.reagentId, experimentId: form.experimentId, quantity: form.quantity, purpose: form.purpose || "实验消耗" });
    ElMessage.success("领用单已提交，库存已冻结，等待实验审核");
    dialogVisible.value = false;
    await Promise.all([reagentStore.load(), reload()]);
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : "领用失败");
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  await Promise.all([reagentStore.load(), experimentStore.load(), reload()]);
});
</script>
