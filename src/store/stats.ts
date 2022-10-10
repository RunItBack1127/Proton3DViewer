import { defineStore } from "pinia";
import { ref } from "vue";

const useStatsStore = defineStore('stats', () => {
    const numVertices = ref(0);
    const numTriangles = ref(0);
    const fileSize = ref(0);
    
    const startUploadTime = ref(0);
    const endUploadTime = ref(0);

    function setNumVertices( vertices: number ) {
        numVertices.value = vertices;
    }

    function setNumTriangles( triangles: number ) {
        numTriangles.value = triangles;
    }

    function setFileSize( size: number ) {
        fileSize.value = size;
    }

    function startUpload() {
        startUploadTime.value = Date.now();
    }

    function endUpload() {
        endUploadTime.value = Date.now();
    }

    function getUploadTime() {
        return endUploadTime.value - startUploadTime.value;
    }

    return {
        numVertices,
        numTriangles,
        fileSize,
        setNumTriangles,
        setNumVertices,
        setFileSize,
        startUpload,
        endUpload,
        getUploadTime
    }
});

export { useStatsStore };