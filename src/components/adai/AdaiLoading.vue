<template>
    <ul class="strip-loading flex-ct-x">
        <li v-for="v in 6" :key="v" :style="`--line-index: ${v}`"></li>
    </ul>
</template>
<style scoped lang="scss">
.strip-loading {
    width: 200px;
    height: 200px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    li {
        --time: calc((var(--line-index) - 1) * 200ms);
        border-radius: 3px;
        width: 6px;
        height: 60px;
        background-color: #f66;
        animation: beat 1.5s ease-in-out var(--time) infinite;
        // & + li {
        //     margin: 0 10px;
        // }
    }
}
@keyframes beat{
    from{
        height: 60px;
    }
    to{
        height: 30px;
    }
}
</style>