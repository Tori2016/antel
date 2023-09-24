import type { ITemplate } from "@/interfaces";

export const useTemplatesStore = defineStore("templates", () => {
  const templates = ref<ITemplate[]>([]);

  return {
    templates,

    setTemplates(newTemplates: ITemplate[]) {
      templates.value = newTemplates;
    },
  };
});
