<template>
    <aside :class="display ? 'displayModal' : ''">
        <article>
            <p>{{ message }}</p>
        </article>
    </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Modal',
    props: {
        message: String,
        display: Boolean
    }
});
</script>

<style lang="scss" scoped>
aside {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 150px;
    transform: scaleX(0);
    transition: transform 200ms ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;

    article {
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #222;
        border-radius: 15px;

        p {
            text-align: center;
            font-size: 1rem;
            font-weight: 300;
            padding: 20px 0;
            color: #fff;
        }
    }

    &.displayModal {
        transform: scaleX(1);
    }
}
</style>