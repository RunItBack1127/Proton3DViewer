<script setup lang="ts">
import SiteHeader from './components/SiteHeader.vue';
import LoadingScreen from './components/LoadingScreen.vue';
import { useUploadStore } from './store/upload';
import { computed } from 'vue';

const uploadStore = useUploadStore();
const isLoadingModel = computed(() => uploadStore.isLoadingModel);
const isDisplayingModel = computed(() => uploadStore.isDisplayingModel);

</script>

<template>
    <SiteHeader />
    <div class="modelContainer"></div>
    <main v-show="!isLoadingModel && !isDisplayingModel">
        <div class="introMessageContainer">
            <h1>Proton, a minimal 3D viewer.</h1>
            <h2>A 3D model viewer designed to get out of your way!</h2>
            <h3>No cookies. No sign up required.</h3>
        </div>
        <div class="uploadContainer">
            <label for="modelFileInput">Upload 3D model</label>
        </div>
        <footer>
            <p>v1.0</p>
        </footer>
    </main>
    <LoadingScreen />
</template>

<style scoped lang="scss">
main {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    height: calc(100vh - 100px);

    .modelContainer {
        display: none;
        width: 100%;
        height: calc(100vh - 100px);
    }

    .introMessageContainer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        h1 {
            font-size: 3rem;
            line-height: 3rem;
            margin-bottom: 20px;
            text-align: center;
        }

        h2 {
            font-size: 2rem;
            font-weight: 200;
            margin-bottom: 5px;
            text-align: center;
        }

        h3 {
            font-size: 1.5rem;
            font-weight: 200;
            text-align: center;
        }
    }

    .uploadContainer {

        width: 100%;
        height: 75px;
        max-width: 600px;
        margin-top: 75px;

        label {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            cursor: pointer;
            background: #000;
            color: #fff;
            text-align: center;
            font-size: 1.35rem;
            font-weight: 300;
            border-radius: 10px;
        }
    }

    footer {
        position: fixed;
        left: 50px;
        bottom: 30px;

        p {
            font-weight: 200;
        }
    }
}
</style>
