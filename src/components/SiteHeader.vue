<template>
    <header :class="isLoadingModel || isDisplayingModel ? 'displayModelHeader' : ''">
        <nav>
            <div class="menuOptionsContainer">
                <form>
                    <label for="modelFileInput" class="optionAvailable optionComponent">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M7.05 40q-1.2 0-2.1-.925-.9-.925-.9-2.075V11q0-1.15.9-2.075Q5.85 8 7.05 8h14l3 3h17q1.15 0 2.075.925.925.925.925 2.075v23q0 1.15-.925 2.075Q42.2 40 41.05 40Zm0-29v26h34V14H22.8l-3-3H7.05Zm0 0v26Z"/></svg>
                    </label>
                    <input type="file" name="modelFileInput" id="modelFileInput" v-on:change="uploadFile" />
                </form>
                <button
                    :class="isDisplayingModel ? 'optionAvailable' : ''"
                    @click="resetZoom"
                    class="optionComponent" >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="m22.4 39.65-11-6.45q-.7-.4-1.075-1.1-.375-.7-.375-1.5V17.75q0-.8.375-1.5t1.075-1.1L22.45 8.6q.7-.4 1.55-.4.85 0 1.55.4l11.05 6.55q.7.4 1.075 1.1.375.7.375 1.5V30.6q0 .8-.4 1.5t-1.1 1.1L25.4 39.65q-.7.4-1.5.4t-1.5-.4Zm.1-3.45V25L13 19.55V30.5Zm3 0 9.55-5.7V19.55L25.5 25ZM2 11.45V7.6q0-2.35 1.625-3.975T7.6 2h3.85v3H7.6q-1.1 0-1.85.75T5 7.6v3.85ZM7.6 46q-2.35 0-3.975-1.625T2 40.4v-3.85h3v3.85q0 1.1.75 1.85T7.6 43h3.85v3Zm28.95-.2v-3h3.85q1.1 0 1.85-.75T43 40.2v-3.85h3v3.85q0 2.35-1.625 3.975T40.4 45.8ZM43 11.45V7.6q0-1.1-.75-1.85T40.4 5h-3.85V2h3.85q2.35 0 3.975 1.625T46 7.6v3.85ZM24 22.3l9.5-5.5-9.5-5.45-9.5 5.45Zm0 1.25Zm0-1.25Zm1.5 2.7Zm-3 0Z"/></svg>
                </button>
                <button
                    @click="toggleShowModelStats"
                    :class="isDisplayingModel ? 'optionAvailable' : ''" class="optionComponent">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M22.65 34h3V22h-3ZM24 18.3q.7 0 1.175-.45.475-.45.475-1.15t-.475-1.2Q24.7 15 24 15q-.7 0-1.175.5-.475.5-.475 1.2t.475 1.15q.475.45 1.175.45ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 23.95q0-4.1 1.575-7.75 1.575-3.65 4.3-6.35 2.725-2.7 6.375-4.275Q19.9 4 24.05 4q4.1 0 7.75 1.575 3.65 1.575 6.35 4.275 2.7 2.7 4.275 6.35Q44 19.85 44 24q0 4.1-1.575 7.75-1.575 3.65-4.275 6.375t-6.35 4.3Q28.15 44 24 44Zm.05-3q7.05 0 12-4.975T41 23.95q0-7.05-4.95-12T24 7q-7.05 0-12.025 4.95Q7 16.9 7 24q0 7.05 4.975 12.025Q16.95 41 24.05 41ZM24 24Z"/></svg>
                </button>
            </div>
            <div class="displayNameContainer">
                <h1>{{ currentModelName }}</h1>
            </div>
            <GitHubButton />
        </nav>
    </header>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import GitHubButton from '@/components/GitHubButton.vue';
import { useUploadStore } from '../store/upload';
import { useStatsStore } from '../store/stats';
import { delimitFileName, uploadModelFile } from '../util/upload';
import { resetProtonCamera } from '../util/graphics/GraphicsBundle';
import { InvalidFileExtensionError } from '../util/InvalidFileExtensionError';

export default defineComponent({
    name: 'SiteHeader',
    components: {
        GitHubButton
    },
    data() {
        const uploadStore = useUploadStore();
        const statsStore = useStatsStore();
        
        function displayCurrentModelName( modelName: string ) {
            const [properName, extension] = delimitFileName( modelName );
            if( modelName !== "" ) {
                return properName.toUpperCase().concat('.').concat( extension );
            }
            return "";
        }

        return {
            setIsLoadingModel: uploadStore.setIsLoadingModel,
            setIsDisplayingModel: uploadStore.setIsDisplayingModel,
            setIsShowingErrorModal: uploadStore.setIsShowingErrorModal,
            setCurrentModelName: uploadStore.setCurrentModelName,
            setIsShowingModelStats: statsStore.setIsShowingModelStats,
            isLoadingModel: computed(() => uploadStore.isLoadingModel),
            isDisplayingModel: computed(() => uploadStore.isDisplayingModel),
            currentModelName: computed(() => {
                const modelName = uploadStore.currentModelName;
                return displayCurrentModelName( modelName );
            }),
            isShowingModelStats: computed(() => statsStore.isShowingModelStats)
        }
    },
    methods: {
        uploadFile( input: Event ) {

            this.setIsLoadingModel( true );
            this.setIsDisplayingModel( false );
            this.setIsShowingErrorModal( false );
            this.setIsShowingModelStats( false );
            
            const target = input.target as HTMLInputElement;
            const files = target.files;

            if( files ) {
                const inputFile = files[ 0 ];
                try {
                    uploadModelFile( inputFile );
                    this.setCurrentModelName( inputFile.name );
                } catch( e ) {
                    if( e instanceof InvalidFileExtensionError ) {
                        this.setIsShowingErrorModal( true );
                        setTimeout(() => {
                            this.setIsShowingErrorModal( false );
                        }, 2500);
                    }
                    else {
                        console.error( e );
                    }
                    this.setIsLoadingModel( false );
                    this.setIsDisplayingModel( false );
                    this.setCurrentModelName("");
                }
            }
        },
        toggleShowModelStats() {
            this.setIsShowingModelStats( !this.isShowingModelStats );
        },
        resetZoom() {
            resetProtonCamera();
        }
    }
});
</script>

<style lang="scss" scoped>
header {
    width: 100%;
    height: 100px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px;

    nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 90%;
        height: 100%;
        margin: auto;
        position: relative;

        .menuOptionsContainer {
            width: 175px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .optionComponent {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 30px;
                height: 30px;
                pointer-events: none;

                svg {
                    width: inherit;
                    height: inherit;
                    opacity: 0.1;
                    transition: opacity 150ms ease;
                    pointer-events: none;
                }
            }

            form {

                label {
                    cursor: pointer;
                }

                input[type="file"] {
                    display: none;
                }
            }

            .optionComponent.optionAvailable {
                pointer-events: all;

                svg {
                    opacity: 0.5;
                }
            }

            .optionComponent.optionAvailable:hover svg {
                opacity: 1.0;
            }
        }

        .displayNameContainer {
            position: absolute;
            width: 100%;
            z-index: -1;
            
            h1 {
                font-weight: 200;
                width: 100%;
                font-size: 1.35rem;
                letter-spacing: 0.1rem;
                text-align: center;
            }
        }
    }

    &.displayModelHeader {
        box-shadow: none;
    }
}

@media screen and (max-width: 766px) {
    header {
        nav {
            .displayNameContainer {
                display: none;
            }
        }
    }
}
</style>