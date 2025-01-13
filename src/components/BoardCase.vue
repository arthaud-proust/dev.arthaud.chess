<template>
  <div
    class="relative aspect-square"
    :style="{backgroundColor}"
  >
    <div
      v-if="playable"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square  opacity-20 rounded-full"
      :class="occupied ? 'h-full border-8 border-neutral-900':'h-1/3 bg-neutral-900'"
    >

    </div>
  </div>
</template>
<script setup lang="ts">
import { BLACK, type Color, WHITE } from "@/core/rules";
import { computed } from "vue";

export type CaseState = "initial" | "active"

const props = withDefaults(
  defineProps<{
    color: Color
    active?: boolean;
    playable?: boolean;
    occupied?: boolean;
  }>(),
  {
    active: false,
    playable: false,
    occupied: false
  }
);

const backgroundColor = computed(() => {
  if (props.color === BLACK) {
    return props.active ? "#BAC949" : "#739552";
  }
  if (props.color === WHITE) {
    return props.active ? "#F5F58D" : "#EBECD0";
  }
});
</script>