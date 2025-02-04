<script lang="ts">
  import { getContext } from "svelte";
  import { Action } from "$lib/types.svelte";
  import { ACCENT_COLOR } from "$lib/ui_constants";
  import { FILL_AND_STROKE_KEY } from "$lib/context_keys";
  import type { FASContext } from "$lib/types.svelte";
  import "./checkers_background.css";

  const fas: FASContext = getContext(FILL_AND_STROKE_KEY);

  const {
    pencilFn,
    selectFn,
    shapeFn,
    eraserFn,
    linesFn,
    fillAndStrokeFn,
    runFn,
    backgroundFn,
    addImgFn,
    menuFn,
    showing_tool,
    using_tool,
  }: {
    pencilFn: (
      button: HTMLElement | undefined,
      event?: Event,
      moved?: boolean
    ) => void;
    selectFn: (
      button: HTMLElement | undefined,
      event?: Event,
      moved?: boolean
    ) => void;
    shapeFn: (
      button: HTMLElement | undefined,
      event?: Event,
      moved?: boolean
    ) => void;
    eraserFn: (
      button: HTMLElement | undefined,
      event?: Event,
      moved?: boolean
    ) => void;
    linesFn: (
      button: HTMLElement | undefined,
      event?: Event,
      moved?: boolean
    ) => void;
    fillAndStrokeFn: (
      button: HTMLElement | undefined,
      event?: Event,
      moved?: boolean
    ) => void;
    runFn: (
      button: HTMLElement | undefined,
      event?: Event,
      moved?: boolean
    ) => void;
    backgroundFn: (
      button: HTMLElement | undefined,
      event?: Event,
      moved?: boolean
    ) => void;
    addImgFn: (
      button: HTMLElement | undefined,
      event?: Event,
      moved?: boolean
    ) => void;
    menuFn: (
      button: HTMLElement | undefined,
      event?: Event,
      moved?: boolean
    ) => void;
    showing_tool: Action;
    using_tool: Action;
  } = $props();

  const using_class = "border-4";
  const not_using_class = "border-2";
  const normal_background_class = "bg-slate-900 hover:bg-slate-800";

  let pencil: HTMLElement | undefined = $state(undefined);
  let pencil_class = $derived(
    using_tool === Action.PENCIL ? using_class : not_using_class
  );
  let pencil_style = $derived(
    "border-color:" +
      (showing_tool === Action.PENCIL ? ACCENT_COLOR : "white") +
      ";"
  );

  let select: HTMLElement | undefined = $state(undefined);
  let select_class = $derived(
    using_tool === Action.SELECT ? using_class : not_using_class
  );
  let select_style = $derived(
    "border-color:" +
      (showing_tool === Action.SELECT ? ACCENT_COLOR : "white") +
      ";"
  );

  let shapes: HTMLElement | undefined = $state(undefined);
  let shapes_class = $derived(
    using_tool === Action.SHAPES ? using_class : not_using_class
  );
  let shapes_style = $derived(
    "border-color:" +
      (showing_tool === Action.SHAPES ? ACCENT_COLOR : "white") +
      ";"
  );

  let eraser: HTMLElement | undefined = $state(undefined);
  let eraser_class = $derived(
    using_tool === Action.ERASER ? using_class : not_using_class
  );
  let eraser_style = $derived(
    "border-color:" +
      (showing_tool === Action.ERASER ? ACCENT_COLOR : "white") +
      ";"
  );

  let lines: HTMLElement | undefined = $state(undefined);
  let lines_class = $derived(
    using_tool === Action.LINES ? using_class : not_using_class
  );
  let lines_style = $derived(
    "border-color:" +
      (showing_tool === Action.LINES ? ACCENT_COLOR : "white") +
      ";"
  );

  let fill_and_stroke: HTMLElement | undefined = $state(undefined);
  let fill_and_stroke_class = $derived(
    using_tool === Action.FILL_AND_STROKE ? using_class : not_using_class
  );
  let fill_and_stroke_style = $derived(
    "border-color:" +
      (showing_tool === Action.FILL_AND_STROKE ? ACCENT_COLOR : "white") +
      ";"
  );

  let background: HTMLElement | undefined = $state(undefined);
  let background_class = $derived(
    using_tool === Action.BACKGROUND ? using_class : not_using_class
  );
  let background_style = $derived(
    "border-color:" +
      (showing_tool === Action.BACKGROUND ? ACCENT_COLOR : "white") +
      ";"
  );

  let run: HTMLElement | undefined = $state(undefined);
  let run_class = $derived(
    using_tool === Action.RUN ? using_class : not_using_class
  );
  let run_style = $derived(
    "border-color:" +
      (showing_tool === Action.RUN ? ACCENT_COLOR : "white") +
      ";"
  );

  let add_image: HTMLElement | undefined = $state(undefined);
  let add_image_class = $derived(
    using_tool === Action.ADD_IMAGE ? using_class : not_using_class
  );
  let add_image_style = $derived(
    "border-color:" +
      (showing_tool === Action.ADD_IMAGE ? ACCENT_COLOR : "white") +
      ";"
  );

  let menu: HTMLElement | undefined = $state(undefined);
  let menu_class = $derived(
    using_tool === Action.MENU ? using_class : not_using_class
  );
  let menu_style = $derived(
    "border-color:" +
      (showing_tool === Action.MENU ? ACCENT_COLOR : "white") +
      ";"
  );

  function scrolled() {
    pencilFn(pencil, undefined, true);
    selectFn(pencil, undefined, true);
    shapeFn(shapes, undefined, true);
    eraserFn(eraser, undefined, true);
    linesFn(lines, undefined, true);
    fillAndStrokeFn(fill_and_stroke, undefined, true);
    runFn(run, undefined, true);
    backgroundFn(background, undefined, true);
    addImgFn(add_image, undefined, true);
    menuFn(menu, undefined, true);
  }
</script>

{#snippet fillAndStrokeIcon()}
  <svg class="w-full h-full" viewBox="0 0 1 1">
    <rect
      width={1}
      height={1}
      opacity={fas.transparency}
      stroke={fas.stroke_color}
      stroke-width={fas.thickness / 23}
      rx="0.2"
      fill={fas.fill_color}
    />
  </svg>
{/snippet}

<div
  onscroll={scrolled}
  class="flex flex-col h-full gap-1.5 sticky bottom-1.5 overflow-y-auto select-none"
>
  <button
    onclick={(e) => pencilFn(pencil, e)}
    bind:this={pencil}
    class="p-0.5 {normal_background_class} active:p-1.5 {pencil_class}"
    style={pencil_style}
  >
    <img src="/icons/pencil.svg" alt="Pencil Icon" />
  </button>
  <button
    onclick={(e) => selectFn(select, e)}
    bind:this={select}
    class="p-0.5 {normal_background_class} active:p-1.5 {select_class}"
    style={select_style}
  >
    <img src="/icons/cursor.svg" alt="Cursor Icon" />
  </button>
  <button
    onclick={(e) => shapeFn(shapes, e)}
    bind:this={shapes}
    class="p-1 {normal_background_class} active:p-2 {shapes_class}"
    style={shapes_style}
  >
    <img src="/icons/shapes.svg" alt="Shapes Icon" />
  </button>
  <button
    onclick={(e) => linesFn(lines, e)}
    bind:this={lines}
    class="p-0.5 {normal_background_class} active:p-1.5 {lines_class}"
    style={lines_style}
  >
    <img src="/icons/polygon.svg" alt="Lines Icon" />
  </button>
  <button
    onclick={(e) => fillAndStrokeFn(fill_and_stroke, e)}
    bind:this={fill_and_stroke}
    class="p-0 {normal_background_class} overflow-clip active:p-1 checkers_backgrund {fill_and_stroke_class}"
    style={fill_and_stroke_style}
  >
    {@render fillAndStrokeIcon()}
  </button>
  <button
    onclick={(e) => eraserFn(eraser, e)}
    bind:this={eraser}
    class="p-1 {normal_background_class} active:p-2 {eraser_class}"
    style={eraser_style}
  >
    <img src="/icons/eraser.svg" alt="Eraser Icon" />
  </button>
  <button
    onclick={(e) => backgroundFn(background, e)}
    bind:this={background}
    class="p-0.5 {normal_background_class} active:p-1.5 {background_class}"
    style={background_style}
  >
    <img src="/icons/background.svg" alt="Background Icon" />
  </button>
  <button
    onclick={(e) => addImgFn(add_image, e)}
    bind:this={add_image}
    class="p-1 {normal_background_class} active:p-2 {add_image_class}"
    style={add_image_style}
  >
    <!-- svelte-ignore a11y_img_redundant_alt -->
    <img src="/icons/plus.svg" alt="Add Image Icon" />
  </button>

  <div class="flex-auto"></div>

  <button
    onclick={(e) => runFn(run, e)}
    bind:this={run}
    class="p-1.5 active:p-2 bg-red-600 hover:bg-red-700 {run_class}"
    style={run_style}
  >
    <img src="/icons/right_arrow.svg" alt="Run Icon" />
  </button>

  <div class="flex-auto"></div>

  <button
    onclick={(e) => menuFn(menu, e)}
    bind:this={menu}
    class="p-1 {normal_background_class} active:p-2 {menu_class}"
    style={menu_style}
  >
    <!-- svelte-ignore a11y_img_redundant_alt -->
    <img src="/icons/burger.svg" alt="Add Image Icon" />
  </button>
</div>

<style>
  @import "tailwindcss";

  button {
    @apply rounded-lg w-8 h-8;
  }
</style>
