<template>
    <div :class="isLoadingModel ? 'showLoadingScreen' : ''" class="loadingContainer">

        <!-- Adapted from SpinKit | Simple CSS Spinners -->
        <!-- https://tobiasahlin.com/spinkit/ -->
        <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useUploadStore } from '../store/upload';

export default defineComponent({
    name: 'LoadingScreen',
    data() {
        const uploadStore = useUploadStore();

        return {
            isLoadingModel: computed(() => uploadStore.isLoadingModel)
        }
    }
});
</script>

<style lang="scss" scoped>
.loadingContainer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: none;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.9);
    z-index: 10000;

    .spinner {
        --animation-duration: 0.5s;
        --bounce-delay: -0.25s;

        div {
            border-radius: 100%;
            display: inline-block;
            -webkit-animation: sk-bouncedelay var(--animation-duration) infinite ease-in-out both;
            animation: sk-bouncedelay var(--animation-duration) infinite ease-in-out both;
            width: 18px;
            height: 18px;
            background-color: #000;
        }

        div:not(:last-child) {
            margin-right: 10px;
        }

        .bounce1 {
            -webkit-animation-delay: var(--bounce-delay);
            animation-delay: var(--bounce-delay);
        }
        
        .bounce2 {
            -webkit-animation-delay: calc(var(--bounce-delay) / 2);
            animation-delay: calc(var(--bounce-delay) / 2);
        }
    }
}

.loadingContainer.showLoadingScreen {
    display: flex;
}

@-webkit-keyframes sk-bouncedelay {
  0%, 80%, 100% { -webkit-transform: scale(0) }
  40% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bouncedelay {
  0%, 80%, 100% { 
    -webkit-transform: scale(0);
    transform: scale(0);
  } 40% { 
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
  }
}
</style>