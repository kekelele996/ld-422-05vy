import { experimentApi } from "../api/experiment";
import type { ExperimentRecord } from "../types/experiment";

export function useExperiment() {
  return {
    create: (payload: Partial<ExperimentRecord>) => experimentApi.create(payload),
    submit: (id: string) => experimentApi.submit(id),
    approve: (id: string, comment = "审核通过") => experimentApi.review(id, "Approved", comment),
    reject: (id: string, comment = "需要修改") => experimentApi.review(id, "RevisionRequired", comment)
  };
}
