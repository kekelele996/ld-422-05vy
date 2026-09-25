import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const required = [
  "src/api/project.ts",
  "src/api/experiment.ts",
  "src/api/reagent.ts",
  "src/api/reagentUsage.ts",
  "src/api/member.ts",
  "src/stores/projectStore.ts",
  "src/stores/experimentStore.ts",
  "src/stores/reagentStore.ts",
  "src/types/index.ts",
  "src/types/enums.ts",
  "src/types/project.ts",
  "src/types/experiment.ts",
  "src/types/reagent.ts",
  "src/types/member.ts",
  "src/components/common/StatusBadge.vue",
  "src/components/common/StockAlert.vue",
  "src/components/common/ProgressBar.vue",
  "src/components/common/Timeline.vue",
  "src/components/common/StepIndicator.vue",
  "src/components/common/EmptyState.vue",
  "src/components/editor/RichTextEditor.vue",
  "src/components/editor/FormulaBlock.vue",
  "src/components/editor/ImageUploader.vue",
  "src/hooks/useExperiment.ts",
  "src/hooks/usePagination.ts",
  "src/pages/Dashboard.vue",
  "src/pages/ProjectManage.vue",
  "src/pages/ExperimentRecords.vue",
  "src/pages/ReagentManage.vue",
  "src/pages/ReagentUsages.vue",
  "src/router/index.ts",
  "src/router/guards.ts",
  "src/utils/formatHazardLevel.ts",
  "src/utils/request.ts",
  "src/constants/apiPaths.ts",
  "src/constants/hazardColors.ts"
];

const missing = required.filter((file) => !existsSync(file));
if (missing.length) {
  console.error(`Missing required files:\n${missing.join("\n")}`);
  process.exit(1);
}

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

const sourceCount = files("src").filter((file) => /\.(ts|vue|js)$/.test(file)).length;
if (sourceCount < 34) {
  console.error(`Expected split source files, found ${sourceCount}`);
  process.exit(1);
}
console.log(`frontend structure check passed with ${sourceCount} source files`);
