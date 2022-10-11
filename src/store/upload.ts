import { defineStore } from "pinia";
import { ref } from "vue";

const useUploadStore = defineStore('upload', () => {
    const isLoadingModel = ref(false);
    const isDisplayingModel = ref(false);
    const isShowingErrorModal = ref(false);
    const currentModelName = ref("");

    function setIsLoadingModel( loading: boolean ) {
        isLoadingModel.value = loading;
    }

    function setIsDisplayingModel( displaying: boolean ) {
        isDisplayingModel.value = displaying;
    }

    function setIsShowingErrorModal( showing: boolean ) {
        isShowingErrorModal.value = showing;
    }

    function setCurrentModelName( modelName: string ) {
        currentModelName.value = modelName;
    }

    return {
        isLoadingModel,
        isDisplayingModel,
        isShowingErrorModal,
        currentModelName,
        setIsLoadingModel,
        setIsDisplayingModel,
        setIsShowingErrorModal,
        setCurrentModelName
    }
});

export { useUploadStore };