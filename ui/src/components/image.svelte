<script>
  import WhiteBoard from "./white_board.svelte";
  let { aspect_ratio } = $props();
</script>

<WhiteBoard {aspect_ratio} right={false} />
