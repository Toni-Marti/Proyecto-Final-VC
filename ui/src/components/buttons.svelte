<script lang="ts">
  import { getContext } from "svelte";
  import { Tool } from "$lib/types";
  import { ACCENT_COLOR, FILL_AND_STROKE_KEY } from "$lib/ui_constants";
  import type { FASContext } from "$lib/types";

  const fas: FASContext = getContext(FILL_AND_STROKE_KEY);

  const {
    pencilFn,
    shapeFn,
    eraserFn,
    linesFn,
    fillAndStrokeFn,
    showing_tool,
    using_tool,
  }: {
    pencilFn: (button: HTMLElement | undefined, moved?: boolean) => void;
    shapeFn: (button: HTMLElement | undefined, moved?: boolean) => void;
    eraserFn: (button: HTMLElement | undefined, moved?: boolean) => void;
    linesFn: (button: HTMLElement | undefined, moved?: boolean) => void;
    fillAndStrokeFn: (button: HTMLElement | undefined, moved?: boolean) => void;
    showing_tool: Tool;
    using_tool: Tool;
    stroke_color: string;
    background_color: string;
  } = $props();

  const using_class = "border-4";
  const not_using_class = "border-2";

  let pencil: HTMLElement | undefined = $state(undefined);
  let pencil_class = $derived(
    using_tool === Tool.PENCIL ? using_class : not_using_class
  );
  let pencil_style = $derived(
    "border-color:" +
      (showing_tool === Tool.PENCIL ? ACCENT_COLOR : "white") +
      ";"
  );

  let shapes: HTMLElement | undefined = $state(undefined);
  let shapes_class = $derived(
    using_tool === Tool.SHAPES ? using_class : not_using_class
  );
  let shapes_style = $derived(
    "border-color:" +
      (showing_tool === Tool.SHAPES ? ACCENT_COLOR : "white") +
      ";"
  );

  let eraser: HTMLElement | undefined = $state(undefined);
  let eraser_class = $derived(
    using_tool === Tool.ERASER ? using_class : not_using_class
  );
  let eraser_style = $derived(
    "border-color:" +
      (showing_tool === Tool.ERASER ? ACCENT_COLOR : "white") +
      ";"
  );

  let lines: HTMLElement | undefined = $state(undefined);
  let lines_class = $derived(
    using_tool === Tool.LINES ? using_class : not_using_class
  );
  let lines_style = $derived(
    "border-color:" +
      (showing_tool === Tool.LINES ? ACCENT_COLOR : "white") +
      ";"
  );

  let fill_and_stroke: HTMLElement | undefined = $state(undefined);
  let fill_and_stroke_class = $derived(
    using_tool === Tool.FILL_AND_STROKE ? using_class : not_using_class
  );
  let fill_and_stroke_style = $derived(
    "border-color:" +
      (showing_tool === Tool.FILL_AND_STROKE ? ACCENT_COLOR : "white") +
      ";"
  );

  function scrolled() {
    pencilFn(pencil, true);
    shapeFn(shapes, true);
    eraserFn(eraser, true);
    linesFn(lines, true);
  }
</script>

{#snippet fillAndStrokeIcon()}
  <svg class="w-full h-full" viewBox="0 0 1 1">
    <rect
      width="1"
      height="1"
      stroke={fas.stroke_color}
      stroke-width={fas.thickness / 20}
      rx="0.18"
      fill={fas.fill_color}
    />
  </svg>
{/snippet}

<div
  onscroll={scrolled}
  class="flex flex-col h-full gap-1.5 sticky bottom-1.5 overflow-y-auto"
>
  <button
    onclick={() => pencilFn(pencil)}
    bind:this={pencil}
    class="p-0.5 active:p-2 {pencil_class}"
    style={pencil_style}
  >
    <img src="/icons/pencil.svg" alt="Pencil Icon" />
  </button>
  <button
    onclick={() => shapeFn(shapes)}
    bind:this={shapes}
    class="p-1 active:p-2 {shapes_class}"
    style={shapes_style}
  >
    <img src="/icons/shapes.svg" alt="Shapes Icon" />
  </button>
  <button
    onclick={() => linesFn(lines)}
    bind:this={lines}
    class="p-0.5 active:p-2 {lines_class}"
    style={lines_style}
  >
    <img src="/icons/polygon.svg" alt="Lines Icon" />
  </button>
  <button
    onclick={() => fillAndStrokeFn(fill_and_stroke)}
    bind:this={fill_and_stroke}
    class="p-0 overflow-clip active:p-1 {fill_and_stroke_class}"
    style={fill_and_stroke_style}
  >
    {@render fillAndStrokeIcon()}
  </button>
  <button
    onclick={() => eraserFn(eraser)}
    bind:this={eraser}
    class="p-1 active:p-2 {eraser_class}"
    style={eraser_style}
  >
    <img src="/icons/eraser.svg" alt="Eraser Icon" />
  </button>

  <div class="flex-auto"></div>

  <button>10</button>

  <div class="flex-auto"></div>

  <button>20</button>
  <button>21</button>
</div>

<style>
  @import "tailwindcss";

  button {
    @apply bg-slate-900 rounded-lg w-10 h-10 hover:bg-slate-800;
  }
</style>
