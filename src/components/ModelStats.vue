<template>
    <aside>
        <div class="fileTypeContainer">
            <h1>{{ modelName }}</h1>
        </div>
        <section>
            <div class="infoContainer">
                <p>File size</p>
                <p>{{ fileSize }}</p>
            </div>
            <div class="infoContainer">
                <p>Load time</p>
                <p>{{ uploadTime }}</p>
            </div>
            <div class="infoContainer">
                <p>Vertices</p>
                <p>{{ numVertices }}</p>
            </div>
            <div class="infoContainer">
                <p>Triangles</p>
                <p>{{ numTriangles }}</p>
            </div>
        </section>
        <button @click="closeStats">Close</button>
    </aside>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStatsStore } from '../store/stats';
import { useUploadStore } from '../store/upload';

export default defineComponent({
    name: 'ModelStats',
    data() {
        const statsStore = useStatsStore();
        const uploadStore = useUploadStore();

        function displayGeometry( stat: number ) {
            return new Intl.NumberFormat('en').format( stat );
        }

        function displayFileSize( fileSize: number ) {
            let numBytes = fileSize;
            const nbMagnitude = Math.floor( Math.log10( numBytes ) );

            if( numBytes < 3 ) {
                return `${numBytes} B`;
            }
            const formatter = new Intl.NumberFormat('en', { maximumSignificantDigits: 3 });
            if( nbMagnitude < 6 ) {
                return `${formatter.format( numBytes / 1000 )} KB`;
            }
            if( nbMagnitude < 9 ) {
                return `${formatter.format( numBytes / 1000000 )} MB`;
            }
            return `${formatter.format( numBytes / 1000000000 )} GB`;
        }

        function displayUploadTime( uploadTime: number ) {
            let numMs = uploadTime;
            const nmMagnitude = Math.floor( Math.log10( numMs ) );
            const formatter = new Intl.NumberFormat('en', { maximumSignificantDigits: 3 });

            if( nmMagnitude < 3 ) {
                return `${formatter.format( numMs )} ms`;
            }
            return `${formatter.format( numMs / 1000)} s`;
        }
        
        return {
            modelName: computed(() => uploadStore.currentModelName),
            numVertices: computed(() => {
                const numVertices = statsStore.numVertices;
                return displayGeometry( numVertices );
            }),
            numTriangles: computed(() => {
                const numTriangles = statsStore.numTriangles;
                return displayGeometry( numTriangles );
            }),
            fileSize: computed(() => {
                const fileSize = statsStore.fileSize;
                return displayFileSize( fileSize )
            }),
            uploadTime: computed(() => {
                const uploadTime = statsStore.getUploadTime();
                return displayUploadTime( uploadTime );
            }),
            isShowingModelStats: computed(() => statsStore.isShowingModelStats),
            setIsShowingModelStats: statsStore.setIsShowingModelStats
        }
    },
    methods: {
        closeStats() {
            this.setIsShowingModelStats( false );
        }
    }
});
</script>

<style lang="scss" scoped>
aside {
    width: 100%;
    max-width: 400px;
    border-radius: 20px;
    padding: 40px 0 35px;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;

    .fileTypeContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding-bottom: 20px;
        border-bottom: 1px solid #000;

        h1 {
            width: 80%;
        }
    }

    section {
        width: 80%;
        margin-top: 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .infoContainer {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            margin-bottom: 10px;

            p {
                font-weight: 300;

                &:nth-child(2) {
                    font-weight: 200;
                    text-align: right;
                }
            }
        }
    }

    button {
        background: #000;
        color: #fff;
        width: 90%;
        font-size: 1.1rem;
        padding: 15px 0;
        border-radius: 10px;
        margin-top: 30px;
    }
}
</style>