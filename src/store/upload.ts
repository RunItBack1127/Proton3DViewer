import { defineStore } from "pinia";
import { ref } from "vue";

const useUploadStore = defineStore('upload', () => {
    const isLoadingModel = ref(false);
    const isDisplayingModel = ref(false);
    const currentModelName = ref("");

    function setIsLoadingModel( loading: boolean ) {
        isLoadingModel.value = loading;
    }

    return {
        isLoadingModel,
        isDisplayingModel,
        setIsLoadingModel
    }
});

export { useUploadStore };