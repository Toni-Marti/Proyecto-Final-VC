<script lang="ts">
  import { getContext } from "svelte";
  import { Tool } from "$lib/types";
  import { Vector2D } from "$lib/types";
  import { ACCENT_COLOR, FILL_AND_STROKE_KEY } from "$lib/ui_constants";
  import type { FASContext } from "$lib/types";

  const fas: FASContext = getContext(FILL_AND_STROKE_KEY);

  const {
    selected_tool,
    point_to,
  }: {
    selected_tool: Tool;
    point_to: Vector2D;
  } = $props();

  // Drawing
  let window_w = $state(0);
  let window_h = $state(0);
  let menu_w = $state(0);
  let menu_h = $state(0);
  const margin = 15;
  const circle_radius = 5;
  const ideal_connector_width = 25;
  const line_width = 4;
  let available_w = $derived(window_w - point_to.x - margin);
  let connector_width = $derived(
    Math.max(0, Math.min(ideal_connector_width, available_w - menu_w))
  );
  const connector_height = 2 * circle_radius;
  let svg_w = $derived(connector_width + connector_height);
  const svg_h = connector_height;
  const svg_offset = new Vector2D(-connector_height / 2, -connector_height / 2);
  let min_h_offset = $derived(-(point_to.y - margin));
  let max_h_offset = $derived(window_h - point_to.y - menu_h - margin);
  let offset: Vector2D = $derived(
    new Vector2D(
      connector_width,
      Math.max(Math.min(-menu_h / 2, max_h_offset), min_h_offset)
    )
  );

  // Other
  let title = $derived(
    selected_tool === Tool.PENCIL
      ? "Free Hand Drawing"
      : selected_tool === Tool.FILL_AND_STROKE
        ? "Fill and Stroke"
        : selected_tool === Tool.LINES
          ? "Polygon"
          : selected_tool === Tool.SHAPES
            ? "Shapes"
            : "Unknown Tool"
  );
</script>

{#snippet color_picker(fill: boolean)}
  {@const name = fill ? "Fill " : "Stroke"}
  <div>{name} Color:</div>
  <div class="grid grid-cols-[auto_1fr] w-full items-center">
    {#if fill}
      <div
        class="rounded-xl overflow-clip border-2 w-9 h-9"
        style="background-color: {fas.fill_color};"
      >
        <input
          class="h-full w-full opacity-0"
          type="color"
          bind:value={fas.fill_color}
        />
      </div>
      <div class="pl-1 flex flex-wrap flex-col pb-1">
        <span>Transparency:</span>
        <input class="w-40" type="range" />
      </div>
    {:else}
      <div
        class="rounded-xl overflow-clip border-2 w-9 h-9"
        style="background-color: {fas.stroke_color};"
      >
        <input
          class="h-full w-full opacity-0"
          type="color"
          bind:value={fas.stroke_color}
        />
      </div>
      <div class="pl-1 flex flex-wrap flex-col pb-1">
        <span>Transparency:</span>
        <input class="w-40" type="range" />
      </div>
    {/if}
  </div>
{/snippet}

<div
  class="absolute select-none"
  style="left: {point_to.x}px; top: {point_to.y}px;"
>
  <div
    bind:clientWidth={menu_w}
    bind:clientHeight={menu_h}
    class="bg-slate-800 border-4 overflow-auto rounded-2xl p-3 absolute"
    style="top: {offset.y}px; left: {offset.x}px;
    max-width: calc({window_w}px - {point_to.x}px - {margin - 5}px);
    max-height: calc({window_h}px - 2*{margin}px);"
  >
    <strong class="text-center text-xl whitespace-nowrap mx-auto block"
      >{title}</strong
    >
    <span>Preview:</span>
    <svg class="w-full min-w-48 h-36 bg-white rounded-2xl"></svg>

    {#if [Tool.PENCIL, Tool.LINES, Tool.SHAPES].includes(selected_tool)}
      <div class="flex items-center pt-5">
        <input type="checkbox" class="h-6 w-6 checked:accent-[#94b6ff]" />
        <span class="pl-1">
          {#if selected_tool === Tool.SHAPES}
            Full
          {:else}
            Closed
          {/if}
        </span>
      </div>
    {/if}
    {#if [Tool.FILL_AND_STROKE].includes(selected_tool)}
      <div class="h-4"></div>
      <div>
        Stroke Width:
        <input
          class="w-full"
          type="range"
          min="1"
          max="17"
          bind:value={fas.thickness}
        />
      </div>
      <div class="h-4"></div>
      {@render color_picker(false)}
      <div class="h-1"></div>
      {@render color_picker(true)}
    {/if}
  </div>
  <svg
    fill="white"
    viewBox="0 0 {svg_w} {svg_h}"
    class="absolute"
    style="top: {svg_offset.x}px; left: {svg_offset.y}px;
      width: {svg_w}px; 
      height: {svg_h}px;"
  >
    <circle r={circle_radius} cx={circle_radius} cy={circle_radius} />
    <circle r={circle_radius} cx={svg_w - circle_radius} cy={circle_radius} />
    <path
      stroke="white"
      stroke-width={line_width}
      d="M {circle_radius} {circle_radius} H {svg_w - circle_radius}"
    />
  </svg>
</div>

<svelte:window bind:innerWidth={window_w} bind:innerHeight={window_h} />
