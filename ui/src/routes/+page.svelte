<script lang="ts">
  import { setContext } from "svelte";
  import Prompt from "../components/prompt.svelte";
  import WiteBoard from "../components/white_board.svelte";
  import Buttons from "../components/buttons.svelte";
  import Image from "../components/image.svelte";
  import ToolSettings from "../components/tool_settings.svelte";
  import { FILL_AND_STROKE_KEY, ACCENT_COLOR } from "$lib/ui_constants";
  import { trapFocus } from "$lib/actions.svelte.js";
  import { Tool } from "$lib/types";
  import { Vector2D } from "$lib/types";

  let aspect_ratio = $state("1/1");
  let fill_and_stroke = $state({
    thickness: 5,
    stroke_color: "#000000",
    fill_color: ACCENT_COLOR,
  });
  setContext(FILL_AND_STROKE_KEY, fill_and_stroke);

  let show_tool_settings = $state(false);
  let showing_tool: { tool: Tool; element: HTMLElement | undefined } = $state({
    tool: Tool.NONE,
    element: undefined,
  });
  let using_tool = $state(Tool.NONE);
  let point_to = $state(new Vector2D());

  function updatePointTo() {
    if (!showing_tool.element) return;

    let rect = showing_tool.element.getBoundingClientRect();
    point_to = new Vector2D(rect.x + rect.width, rect.y + rect.height / 2);
  }

  const use_when_clicked = [Tool.PENCIL, Tool.SHAPES, Tool.ERASER, Tool.LINES];
  const show_when_clicked = [
    Tool.PENCIL,
    Tool.SHAPES,
    Tool.LINES,
    Tool.FILL_AND_STROKE,
  ];
  function genericToolPressed(
    button: HTMLElement | undefined,
    tool: Tool,
    moved = false
  ) {
    if (!button) return;
    const clicked = !moved;
    if (clicked) {
      if (show_when_clicked.includes(tool)) {
        showing_tool.element = button;
        show_tool_settings = showing_tool.tool !== tool || !show_tool_settings;
        showing_tool.tool = tool;
      } else {
        showing_tool.element = undefined;
        showing_tool.tool = Tool.NONE;
      }

      if (use_when_clicked.includes(tool)) {
        using_tool = tool;
      }
    }

    if (moved && showing_tool.tool === tool) {
      showing_tool.element = button;
    }

    updatePointTo();
  }
</script>

<div
  class="grid grid-rows-[minmax(auto,max_content)_min-content]
  grid-cols-[minmax(0,1fr)_max-content_minmax(0,1fr)] gap-1.5 bg-slate-950
  text-white p-3 w-screen h-screen relative"
  use:trapFocus
>
  <select
    name="pets"
    id="pet-select"
    class="bg-slate-800 text-white h-min"
    bind:value={aspect_ratio}
  >
    <option value="1/1">1:1</option>
    <option value="2/1">2:1</option>
    <option value="16/9">16:9</option>
    <option value="1/2">1:2</option>
    <option value="9/16">9:16</option>
  </select>

  <div></div>
  <Prompt />
  <WiteBoard {aspect_ratio} />
  <Buttons
    pencilFn={(button, moved) => genericToolPressed(button, Tool.PENCIL, moved)}
    shapeFn={(button, moved) => genericToolPressed(button, Tool.SHAPES, moved)}
    eraserFn={(button, moved) => genericToolPressed(button, Tool.ERASER, moved)}
    linesFn={(button, moved) => genericToolPressed(button, Tool.LINES, moved)}
    fillAndStrokeFn={(button, moved) =>
      genericToolPressed(button, Tool.FILL_AND_STROKE, moved)}
    showing_tool={showing_tool.tool}
    {using_tool}
  />
  <Image {aspect_ratio} />

  {#if showing_tool.tool !== Tool.NONE}
    <ToolSettings selected_tool={showing_tool.tool} {point_to} />
  {/if}
</div>

<svelte:window on:resize={updatePointTo} />
