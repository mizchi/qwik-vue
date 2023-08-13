<script setup>
import { ref, defineProps } from 'vue';
const props = defineProps(["counter"]);
const count = ref(0);
</script>

<template>
  <div>{{props.counter}}</div>
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>