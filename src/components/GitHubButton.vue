<template>
    <a :class="isDisplayingModel ? 'displayingModel' : ''" href="https://github.com/RunItBack1127/Proton3DViewer" target="_blank" rel="noopener noreferrer" class="githubContainer">
        <div class="hideContainer"></div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
        </svg>
        <div class="bannerContainer">Source on GitHub</div>
    </a>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useUploadStore } from '../store/upload';

export default defineComponent({
    name: 'SlidingButton',
    data() {
        const uploadStore = useUploadStore();

        return {
            isDisplayingModel: computed(() => uploadStore.isDisplayingModel)
        }
    }
});
</script>

<style lang="scss" scoped>
a.githubContainer {

    --sliding-button-width: 250px;

    position: relative;
    right: 0;
    display: flex;
    align-items: center;
    width: var(--sliding-button-width);
    height: 100%;
    transition: opacity 150ms ease;

    .hideContainer,
    .bannerContainer {
        pointer-events: none;
    }

    .hideContainer {
        position: absolute;
        z-index: 1;
        height: 100%;
        background: #fff;
        transition: width 200ms ease;
        transform: translateX(20px);
    }

    .bannerContainer {
        position: absolute;
        z-index: -1;
        width: var(--sliding-button-width);
        height: 20px;
        border-radius: 50px;
        display: flex;
        align-items: center;
        background: #222;
        color: #fff;
        padding: 30px 30px;
        transform: translateX(20px);
    }

    svg {
        display: flex;
        justify-content: center;
        align-items: center;
        fill: #fff;
        position: absolute;
        right: 0;
        width: 25px;
        height: 25px;
        z-index: 100;
        border-radius: 50px;
        transition: fill 100ms ease;
    }

    &:hover {
        opacity: 0.95;
    
        &.displayingModel {
            opacity: 1.0;

            svg {
                fill: #fff;
            }

            .hideContainer {
                width: 0;
            }
        }
    }

    &.displayingModel {

        .hideContainer {
            width: var(--sliding-button-width);
        }

        svg {
            fill: #222;
        }
    }
}

@media screen and (max-width: 576px) {
    a.githubContainer {
        position: absolute;
        --sliding-button-width: 25px;

        .hideContainer {
            display: none;
        }
        
        .bannerContainer {
            display: none;
        }

        svg {
            fill: #222;
            transition: none;
        }

        &:hover {

            &.displayingModel {
                
                svg {
                    fill: #222;
                }
            }
        }
    }
}
</style>