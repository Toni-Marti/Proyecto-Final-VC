<script lang="ts">
  import { getContext } from "svelte";
  import ImageDrawer from "./image_drawer.svelte";
  import CenteredBox from "./PopUps/centered_box.svelte";
  import { Action, Vector2D } from "$lib/types.svelte";
  import { ACCENT_COLOR, MAX_WIDTH } from "$lib/ui_constants";
  import { FILL_AND_STROKE_KEY, BACKGROUND_KEY } from "$lib/context_keys";
  import "./checkers_background.css";
  import type { FASContext, BackgroundContext } from "$lib/types.svelte";

  const fas: FASContext = getContext(FILL_AND_STROKE_KEY);
  const background: BackgroundContext = getContext(BACKGROUND_KEY);

  const {
    selected_tool,
    point_to,
  }: {
    selected_tool: Action;
    point_to: Vector2D;
  } = $props();

  // Drawing
  let window_w = $state(0);
  let window_h = $state(0);
  let menu_w = $state(0);
  let menu_h = $state(0);
  const margin = 30;
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
    selected_tool === Action.PENCIL
      ? "Free Hand Drawing"
      : selected_tool === Action.FILL_AND_STROKE
        ? "Fill and Stroke"
        : selected_tool === Action.LINES
          ? "Polygon"
          : selected_tool === Action.SHAPES
            ? "Shapes"
            : selected_tool === Action.BACKGROUND
              ? "Background"
              : selected_tool === Action.ADD_IMAGE
                ? "Add Image"
                : selected_tool === Action.MENU
                  ? "Generation Behavior"
                  : "Unknown"
  );

  let show_bg_img_sele = $state(false);

  const tools_with_preview = [
    Action.PENCIL,
    Action.SHAPES,
    Action.LINES,
    Action.FILL_AND_STROKE,
  ];
</script>

{#snippet color_picker(
  title: string,
  get_set: { get: () => string; set: (value: string) => void }
)}
  <div class="grid grid-cols-[40px_1fr] grid-rows-[40px] w-full items-center">
    <div
      class="rounded-xl overflow-clip checkers_backgrund border-2 w-full h-full"
    >
      <div class="w-full h-full" style="background-color: {get_set.get()};">
        <input
          class="w-full h-full opacity-0"
          type="color"
          bind:value={get_set.get, get_set.set}
        />
      </div>
    </div>
    <div class="pl-1 inline-block top-0">- {title}</div>
  </div>
{/snippet}

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  onclick={(e) => {
    e.stopPropagation();
  }}
  class="absolute select-none"
  style="left: {point_to.x}px; top: {point_to.y}px;"
>
  <div
    bind:clientWidth={menu_w}
    bind:clientHeight={menu_h}
    class="bg-slate-900 border-4 overflow-y-auto rounded-2xl absolute"
    style="top: {offset.y}px; left: {offset.x}px;
    max-width: calc({window_w}px - {point_to.x}px - {margin - 5}px);
    max-height: calc({window_h}px - 2*{margin}px);"
  >
    <strong
      class="text-center text-xl whitespace-nowrap w-full block sticky top-0 left-0 bg-slate-900 z-10 pt-0 px-3"
      style="padding-top: 12px;"
    >
      {title}
    </strong>
    <div class="p-3 pt-0">
      {#if tools_with_preview.includes(selected_tool)}
        <span>Preview:</span>
        <svg class="w-full min-w-48 h-36 checkers_backgrund rounded-2xl"></svg>
      {/if}

      {#if [Action.PENCIL, Action.LINES, Action.SHAPES].includes(selected_tool)}
        <div class="flex items-center pt-5">
          <input type="checkbox" class="h-6 w-6 checked:accent-[#94b6ff]" />
          <span class="pl-1">
            {#if selected_tool === Action.SHAPES}
              Full
            {:else}
              Closed
            {/if}
          </span>
        </div>
      {/if}
      {#if [Action.FILL_AND_STROKE].includes(selected_tool)}
        <div class="h-4"></div>
        <div>
          Stroke Width: {Math.round(fas.thickness * (100 / 17))}
          <input
            class="w-full"
            type="range"
            min="1"
            max={MAX_WIDTH}
            step={MAX_WIDTH / 100}
            bind:value={fas.thickness}
          />
        </div>
        <div class="h-2"></div>
        {@render color_picker("Fill Color", {
          get: () => fas.fill_color,
          set: (value) => (fas.fill_color = value),
        })}
        <div class="h-2"></div>
        {@render color_picker("Stroke Color", {
          get: () => fas.stroke_color,
          set: (value) => (fas.stroke_color = value),
        })}
        <div class="h-3"></div>
        <span>Object Transparency: {fas.transparency}</span>
        <input
          class="w-full"
          type="range"
          min="0"
          max="1"
          step="0.01"
          bind:value={fas.transparency}
        />
      {/if}
      {#if selected_tool === Action.BACKGROUND}
        <div class="w-50">
          {@render color_picker("Background Color", {
            get: () => background.color,
            set: (value) => (background.color = value),
          })}
        </div>
        {#if background.image}
          <div class="flex justify-center">
            <img
              src={background.image}
              class="max-w-16 max-h-16 w-auto h-auto border-1 m-2 ml-0 inline"
              alt="Background"
            />
            <div class="content-center">
              <button
                onclick={() => (background.image = "")}
                class="bg-slate-900 hover:bg-slate-800 block rounded-full h-fit"
              >
                <!-- svelte-ignore a11y_img_redundant_alt -->
                <img
                  src="/icons/plus.svg"
                  class="w-9 h-9 rotate-45 p-2"
                  alt="Remove background image"
                />
              </button>
            </div>
          </div>
        {:else}
          <button
            class="bg-slate-900 hover:bg-slate-800 p-2 px-3 mx-auto block border-white border-2 rounded-lg mt-2"
            onclick={() => {
              show_bg_img_sele = true;
            }}>Select Image</button
          >
        {/if}
      {/if}
      {#if selected_tool === Action.ADD_IMAGE}
        <div class="w-xl">
          <ImageDrawer />
        </div>
      {/if}
    </div>
  </div>

  <!-- Connector -->
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

{#if show_bg_img_sele && selected_tool === Action.BACKGROUND}
  <CenteredBox
    ><ImageDrawer
      setImgSrc={(src) => {
        background.image = src;
        show_bg_img_sele = false;
      }}
      cancelFn={() => (show_bg_img_sele = false)}
    /></CenteredBox
  >
{/if}
<svelte:window bind:innerWidth={window_w} bind:innerHeight={window_h} />
