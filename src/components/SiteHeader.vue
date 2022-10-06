<template>
    <header>
        <nav>
            <div class="menuOptionsContainer">
                <form>
                    <label for="modelFileInput" class="optionAvailable optionComponent">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M7.05 40q-1.2 0-2.1-.925-.9-.925-.9-2.075V11q0-1.15.9-2.075Q5.85 8 7.05 8h14l3 3h17q1.15 0 2.075.925.925.925.925 2.075v23q0 1.15-.925 2.075Q42.2 40 41.05 40Zm0-29v26h34V14H22.8l-3-3H7.05Zm0 0v26Z"/></svg>
                    </label>
                    <input type="file" name="modelFileInput" id="modelFileInput" v-on:change="uploadFile" />
                </form>
                <button :class="isDisplayingModel ? 'optionAvailable' : ''" class="optionComponent">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="m22.4 39.65-11-6.45q-.7-.4-1.075-1.1-.375-.7-.375-1.5V17.75q0-.8.375-1.5t1.075-1.1L22.45 8.6q.7-.4 1.55-.4.85 0 1.55.4l11.05 6.55q.7.4 1.075 1.1.375.7.375 1.5V30.6q0 .8-.4 1.5t-1.1 1.1L25.4 39.65q-.7.4-1.5.4t-1.5-.4Zm.1-3.45V25L13 19.55V30.5Zm3 0 9.55-5.7V19.55L25.5 25ZM2 11.45V7.6q0-2.35 1.625-3.975T7.6 2h3.85v3H7.6q-1.1 0-1.85.75T5 7.6v3.85ZM7.6 46q-2.35 0-3.975-1.625T2 40.4v-3.85h3v3.85q0 1.1.75 1.85T7.6 43h3.85v3Zm28.95-.2v-3h3.85q1.1 0 1.85-.75T43 40.2v-3.85h3v3.85q0 2.35-1.625 3.975T40.4 45.8ZM43 11.45V7.6q0-1.1-.75-1.85T40.4 5h-3.85V2h3.85q2.35 0 3.975 1.625T46 7.6v3.85ZM24 22.3l9.5-5.5-9.5-5.45-9.5 5.45Zm0 1.25Zm0-1.25Zm1.5 2.7Zm-3 0Z"/></svg>
                </button>
                <button :class="isDisplayingModel ? 'optionAvailable' : ''" class="optionComponent">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M17.85 39.65 15.7 37.5l4-4.05q-6.8-.75-11.25-3.3T4 23.7q0-3.95 5.825-6.725Q15.65 14.2 24 14.2q8.4 0 14.2 2.775Q44 19.75 44 23.7q0 2.95-3.2 5.2t-8.5 3.5v-3.25q4-1 6.35-2.6Q41 24.95 41 23.7q0-1.6-4.175-4.05Q32.65 17.2 24 17.2q-8.6 0-12.8 2.45Q7 22.1 7 23.7q0 2.25 2.875 3.875t9.975 2.975L15.7 26.5l2.15-2.15 7.65 7.6Z"/></svg>
                </button>
            </div>
            <div class="displayNameContainer">
                <h1>{{ currentModelName }}</h1>
            </div>
            <SlidingButton />
        </nav>
    </header>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import SlidingButton from '@/components/SlidingButton.vue';
import { useUploadStore } from '../store/upload';
import { uploadModelFile } from '../util/upload';
import { InvalidFileExtensionError } from '../util/InvalidFileExtensionError';

export default defineComponent({
    name: 'SiteHeader',
    components: {
        SlidingButton
    },
    data() {
        const uploadStore = useUploadStore();

        return {
            setIsLoadingModel: uploadStore.setIsLoadingModel,
            setIsDisplayingModel: uploadStore.setIsDisplayingModel,
            setCurrentModelName: uploadStore.setCurrentModelName,
            isDisplayingModel: computed(() => uploadStore.isDisplayingModel),
            currentModelName: computed(() => uploadStore.currentModelName)
        }
    },
    methods: {
        uploadFile( input: Event ) {

            this.setIsLoadingModel( true );
            this.setIsDisplayingModel( false );
            
            const target = input.target as HTMLInputElement;
            const files = target.files;

            if( files ) {
                const inputFile = files[ 0 ];
                try {
                    uploadModelFile( inputFile.name );
                    this.setCurrentModelName( inputFile.name );
                    this.setIsDisplayingModel( true );
                } catch( e ) {
                    if( e instanceof InvalidFileExtensionError ) {
                        
                    }
                    console.error( e );
                } finally {
                    this.setIsLoadingModel( false );
                }
            }
        }
    }
});
</script>

<style lang="scss" scoped>
header {
    width: 100%;
    height: 100px;

    nav {
        display: grid;
        grid-template-columns: 175px auto 250px;
        align-items: center;
        width: 90%;
        height: 100%;
        margin: auto;
        position: relative;

        .menuOptionsContainer {
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
                pointer-events: initial;

                svg {
                    opacity: 0.5;
                }
            }

            .optionComponent.optionAvailable:hover svg {
                opacity: 1.0;
            }
        }

        .displayNameContainer {

            width: 100%;
            
            h1 {
                font-weight: 200;
                width: 100%;
                font-size: 1.35rem;
                letter-spacing: 0.1rem;
                text-align: center;
            }
        }
    }
}
</style>