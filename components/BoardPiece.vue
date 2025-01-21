<template>
  <div class="aspect-square flex items-center justify-center">
    <img
      class="h-5/6 aspect-square pointer-events-none"
      v-if="pieceDatas[piece]"
      :src="pieceDatas[piece]?.src"
      :alt="pieceDatas[piece]?.alt"
    />
  </div>
</template>
<script setup lang="ts">
import {
  __,
  BB,
  BK,
  BN,
  BP,
  BQ,
  BR,
  type Piece,
  WB,
  WK,
  WN,
  WP,
  WQ,
  WR,
} from "@/core/rules";

defineProps<{
  piece: Piece;
}>();

const pieceDatas = {
  [__]: null,
  [WK]: { src: "/pieces/WK.png", alt: "White King" },
  [WQ]: { src: "/pieces/WQ.png", alt: "White Queen" },
  [WB]: { src: "/pieces/WB.png", alt: "White Bishop" },
  [WR]: { src: "/pieces/WR.png", alt: "White Rook" },
  [WN]: { src: "/pieces/WN.png", alt: "White Knight" },
  [WP]: { src: "/pieces/WP.png", alt: "White Pawn" },
  [BK]: { src: "/pieces/BK.png", alt: "Black King" },
  [BQ]: { src: "/pieces/BQ.png", alt: "Black Queen" },
  [BB]: { src: "/pieces/BB.png", alt: "Black Bishop" },
  [BR]: { src: "/pieces/BR.png", alt: "Black Rook" },
  [BN]: { src: "/pieces/BN.png", alt: "Black Knight" },
  [BP]: { src: "/pieces/BP.png", alt: "Black Pawn" },
};
</script>
