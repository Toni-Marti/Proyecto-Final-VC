<script lang="ts">
  import WhiteBoard from "./white_board.svelte";
  import type { BackgroundContext } from "$lib/types.svelte";

  let { aspect_ratio } = $props();
  const background: BackgroundContext = { color: "grey", image: null, mode: 0 };
</script>

<WhiteBoard {background} {aspect_ratio} right={false} />
