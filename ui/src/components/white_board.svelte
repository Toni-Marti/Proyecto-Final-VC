<script lang="ts">
  import type { BackgroundContext } from "$lib/types.svelte";
  const {
    aspect_ratio,
    right = true,
    background,
  }: {
    aspect_ratio: string;
    right?: boolean;
    background: BackgroundContext;
  } = $props();

  let alignment_class = $derived(right ? "ml-auto" : "mr-auto");
  let ar: number = $derived(eval(aspect_ratio));
</script>

<svg
  style="aspect-ratio: {aspect_ratio}; background-color: {background.color};"
  class="max-h-full min-h-auto min-w-auto max-w-full self-center {alignment_class}"
  viewBox="0 0 {100 * Math.min(1, ar)} {100 / Math.max(1, ar)}"
>
  <image
    href={background.image}
    preserveAspectRatio={true}
    x="0"
    y="0"
    width={100}
    height={100}
  ></image>
</svg>
