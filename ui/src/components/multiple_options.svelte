<script lang="ts">
  const {
    elements,
    selected_i,
  }: {
    elements: Array<{ title: String; whenSelectedFn: () => void }>;
    selected_i: number;
  } = $props();

  const selected_class = "bg-slate-700";
  const not_selected_class = "bg-slate-900 hover:bg-slate-800";
</script>

<div class="flex">
  {#each elements as element}
    {@const ele_class =
      elements.indexOf(element) === selected_i
        ? selected_class
        : not_selected_class}
    <button class="ele_class" onclick={element.whenSelectedFn}>
      element.title
    </button>
  {/each}
</div>
