<script setup lang="ts">
  import { ref, defineProps, watch } from 'vue';
  const props = defineProps<{counter: number, onUpdate: (current: number) => void}>();
  const count = ref(0);
  watch(count, (val) => {
    props.onUpdate(val);
  });
</script>

<template>
  <div>{{props.counter}}</div>
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>