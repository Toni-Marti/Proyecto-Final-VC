<script lang="ts">
  import { setContext } from "svelte";
  import Prompt from "../components/prompt.svelte";
  import WiteBoard from "../components/white_board.svelte";
  import Buttons from "../components/buttons.svelte";
  import Result from "../components/result.svelte";
  import ToolSettings from "../components/tool_settings.svelte";
  import { ACCENT_COLOR } from "$lib/ui_constants";
  import {
    FILL_AND_STROKE_KEY,
    FREE_HAND_KEY,
    SHAPES_KEY,
    POLYGON_KEY,
    BACKGROUND_KEY,
    ROOT_FOLDER_KEY,
  } from "$lib/context_keys";
  import { trapFocus } from "$lib/actions.svelte.js";
  import {
    Action,
    Vector2D,
    BackgroundImageMode,
    VirtualDir,
  } from "$lib/types.svelte";
  import type {
    FASContext,
    LinesContext,
    ShapesContext,
    BackgroundContext,
  } from "$lib/types.svelte";

  let white_board_ar: string = $state("1/1");
  let image_ar: string = $derived(white_board_ar);

  let fill_and_stroke: FASContext = $state({
    thickness: 5,
    stroke_color: "#000000",
    fill_color: ACCENT_COLOR,
    transparency: 1,
  });
  setContext(FILL_AND_STROKE_KEY, fill_and_stroke);

  let free_hand: LinesContext = $state({
    closed: false,
    full: false,
  });
  setContext(FREE_HAND_KEY, free_hand);

  let shapes: ShapesContext = $state({
    full: true,
    stroke: true,
  });
  setContext(SHAPES_KEY, shapes);

  let polygon: LinesContext = $state({
    closed: false,
    full: false,
  });
  setContext(POLYGON_KEY, polygon);

  let background: BackgroundContext = $state({
    color: "#ffffff",
    image: null,
    mode: BackgroundImageMode.NONE,
  });
  setContext(BACKGROUND_KEY, background);

  let root: VirtualDir = new VirtualDir("/root");
  setContext(ROOT_FOLDER_KEY, root);

  let show_tool_settings = $state(false);
  let showing_tool: { tool: Action; element: HTMLElement | undefined } = $state(
    {
      tool: Action.NONE,
      element: undefined,
    }
  );
  let using_tool = $state(Action.NONE);
  let point_to = $state(new Vector2D());

  function updatePointTo() {
    if (!showing_tool.element) return;

    let rect = showing_tool.element.getBoundingClientRect();
    point_to = new Vector2D(rect.x + rect.width, rect.y + rect.height / 2);
  }

  const use_when_clicked = [
    Action.PENCIL,
    Action.SELECT,
    Action.SHAPES,
    Action.ERASER,
    Action.LINES,
  ];
  const show_when_clicked = [
    Action.PENCIL,
    Action.SHAPES,
    Action.LINES,
    Action.FILL_AND_STROKE,
    Action.BACKGROUND,
    Action.ADD_IMAGE,
    Action.MENU,
  ];
  function genericToolPressed(
    button: HTMLElement | undefined,
    tool: Action,
    event?: Event,
    moved = false
  ) {
    if (event) event.stopPropagation();

    if (!button) return;
    const clicked = !moved;
    if (clicked) {
      if (show_when_clicked.includes(tool)) {
        showing_tool.element = button;
        show_tool_settings = showing_tool.tool !== tool || !show_tool_settings;
        showing_tool.tool = tool;
      } else {
        showing_tool.element = undefined;
        showing_tool.tool = Action.NONE;
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

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  onclick={() => {
    show_tool_settings = false;
    showing_tool.tool = Action.NONE;
  }}
  class="grid grid-rows-[minmax(auto,max_content)_min-content]
  grid-cols-[minmax(0,1fr)_max-content_minmax(0,1fr)] gap-1.5 bg-slate-950
  text-white p-3 w-screen h-screen relative"
  use:trapFocus
>
  <select
    name="pets"
    id="pet-select"
    class="bg-slate-800 text-white h-min"
    bind:value={white_board_ar}
  >
    <option value="1/1">1:1</option>
    <option value="2/1">2:1</option>
    <option value="16/9">16:9</option>
    <option value="1/2">1:2</option>
    <option value="9/16">9:16</option>
  </select>

  <div></div>
  <Prompt />
  <WiteBoard aspect_ratio={white_board_ar} {background} />
  <Buttons
    pencilFn={(button, event, moved) =>
      genericToolPressed(
        button,
        Action.PENCIL,
        show_when_clicked.includes(Action.PENCIL) ? event : undefined,
        moved
      )}
    selectFn={(button, event, moved) =>
      genericToolPressed(
        button,
        Action.SELECT,
        show_when_clicked.includes(Action.SELECT) ? event : undefined,
        moved
      )}
    shapeFn={(button, event, moved) =>
      genericToolPressed(
        button,
        Action.SHAPES,
        show_when_clicked.includes(Action.SHAPES) ? event : undefined,
        moved
      )}
    eraserFn={(button, event, moved) =>
      genericToolPressed(
        button,
        Action.ERASER,
        show_when_clicked.includes(Action.ERASER) ? event : undefined,
        moved
      )}
    linesFn={(button, event, moved) =>
      genericToolPressed(
        button,
        Action.LINES,
        show_when_clicked.includes(Action.LINES) ? event : undefined,
        moved
      )}
    fillAndStrokeFn={(button, event, moved) =>
      genericToolPressed(
        button,
        Action.FILL_AND_STROKE,
        show_when_clicked.includes(Action.FILL_AND_STROKE) ? event : undefined,
        moved
      )}
    runFn={(button, event, moved) =>
      genericToolPressed(
        button,
        Action.RUN,
        show_when_clicked.includes(Action.RUN) ? event : undefined,
        moved
      )}
    backgroundFn={(button, event, moved) =>
      genericToolPressed(
        button,
        Action.BACKGROUND,
        show_when_clicked.includes(Action.BACKGROUND) ? event : undefined,
        moved
      )}
    addImgFn={(button, event, moved) =>
      genericToolPressed(
        button,
        Action.ADD_IMAGE,
        show_when_clicked.includes(Action.ADD_IMAGE) ? event : undefined,
        moved
      )}
    menuFn={(button, event, moved) =>
      genericToolPressed(
        button,
        Action.MENU,
        show_when_clicked.includes(Action.MENU) ? event : undefined,
        moved
      )}
    showing_tool={showing_tool.tool}
    {using_tool}
  />
  <Result aspect_ratio={image_ar} />

  {#if show_tool_settings && showing_tool.tool !== Action.NONE}
    <ToolSettings selected_tool={showing_tool.tool} {point_to} />
  {/if}
</div>

<svelte:window on:resize={updatePointTo} />
