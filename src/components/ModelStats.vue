<template>
    <aside>
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
            <button @click="closeStats">soisjs</button>
        </section>
    </aside>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStatsStore } from '../store/stats';

export default defineComponent({
    name: 'ModelStats',
    data() {
        const statsStore = useStatsStore();
        
        return {
            numVertices: computed(() => statsStore.numVertices),
            numTriangles: computed(() => statsStore.numTriangles),
            fileSize: -1,
            uploadTime: -1
        }
    },
    methods: {
        closeStats() {

        }
    }
})
</script>

<style lang="scss" scoped>

</style>