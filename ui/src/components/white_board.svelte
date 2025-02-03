<script>
  const { aspect_ratio, right = true } = $props();

  let alignment_class = $derived(right ? "ml-auto" : "mr-auto");
</script>

<svg
  style="aspect-ratio: {aspect_ratio};"
  class="bg-gray-400 max-h-full min-h-auto min-w-auto max-w-full {alignment_class}"
>
</svg>
