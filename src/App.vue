<script setup lang="ts">
import { computed } from 'vue';

import SiteHeader from './components/SiteHeader.vue';
import LoadingScreen from './components/LoadingScreen.vue';
import Modal from './components/Modal.vue';
import ModelStats from './components/ModelStats.vue';

import { useUploadStore } from './store/upload';

const uploadStore = useUploadStore();
const isLoadingModel = computed(() => uploadStore.isLoadingModel);
const isDisplayingModel = computed(() => uploadStore.isDisplayingModel);
const isShowingErrorModal = computed(() => uploadStore.isShowingErrorModal);

</script>

<template>
    <SiteHeader />
    <div v-show="isDisplayingModel" class="modelContainer"></div>
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
    <Modal
        :display="isShowingErrorModal"
        message="Proton does not currently support files with this extension."
        />
    <ModelStats />
</template>

<style scoped lang="scss">
main {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    height: calc(100vh - 100px);

    .introMessageContainer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        h1 {
            font-size: 3.25rem;
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
        margin-top: 90px;

        label {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            cursor: pointer;
            background: #000;
            border: 1px solid #000;
            color: #000;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.25rem;
            font-size: 1.35rem;
            font-weight: 200;
            border-radius: 10px;
            background-color: transparent;
            background-repeat: no-repeat;
            background-image: linear-gradient(to right, #000, #000);
            background-size: 0%;
            transition: background-size 150ms ease, color 150ms ease;
            
            &:hover {
                background-size: 100%;
                color: #fff;
            }
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

.modelContainer {
    width: 100%;
    height: calc(100vh - 100px);
}
</style>
