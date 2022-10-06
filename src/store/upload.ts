import { defineStore } from "pinia";
import { ref } from "vue";
import { delimitFileName } from "../util/upload";

const useUploadStore = defineStore('upload', () => {
    const isLoadingModel = ref(false);
    const isDisplayingModel = ref(false);
    const currentModelName = ref("");

    function setIsLoadingModel( loading: boolean ) {
        isLoadingModel.value = loading;
    }

    function setIsDisplayingModel( displaying: boolean ) {
        isDisplayingModel.value = displaying;
    }

    function setCurrentModelName( modelName: string ) {
        const [properName, extension] = delimitFileName( modelName );
        currentModelName.value = properName.toUpperCase().concat('.').concat( extension );
    }

    return {
        isLoadingModel,
        isDisplayingModel,
        currentModelName,
        setIsLoadingModel,
        setCurrentModelName
    }
});

export { useUploadStore };