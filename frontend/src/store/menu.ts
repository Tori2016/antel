export const useMenuStore = defineStore("menu", () => {
  const togglesidebar = ref<boolean>(false);
  const activeoverlay = ref<boolean>(false);

  return {
    // State
    togglesidebar,
    activeoverlay,

    // Getters

    // Actions
    opensidebar() {
      if (process.client) {
        togglesidebar.value = !togglesidebar.value;
        activeoverlay.value = !activeoverlay.value;
      }
    },
  };
});
