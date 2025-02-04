<script lang="ts">
  import { getContext } from "svelte";
  import { ROOT_FOLDER_KEY } from "$lib/context_keys";
  import { VirtualDir, Image } from "$lib/types.svelte";
  import { IMPORTS_FOLDER_NAME } from "$lib/constants";

  const {
    setImgSrc,
    cancelFn,
  }: { setImgSrc?: (src: string) => void; cancelFn?: () => void } = $props();

  const root: VirtualDir = getContext(ROOT_FOLDER_KEY);
  let selected_name: string = $state("");
  let viewing_dir: VirtualDir = $state(root);

  const element_class =
    "w-27 h-27 rounded-lg p-1 overflow-clip hover:bg-slate-800 mx-auto";
  const icon_class = "w-16 max-h-16 mx-auto";
  const name_class = "text-white text-center text-sm break-words";

  const dialog_button_class =
    "p-2 px-3 mx-0.5 rounded-lg border-2 border-white hover:bg-slate-800 bg-slate-900 disabled:text-gray-600 disabled:bg-gray-800 disabled:border-gray-400";
</script>

{#snippet imgSnippet(image: Image)}
  <button
    onclick={() => {
      if (selected_name === image.name && setImgSrc) {
        setImgSrc(image.src);
      }
      selected_name = image.name;
    }}
    class="{selected_name === image.name
      ? 'bg-slate-800 border-2 border-white bg-gr'
      : ''} {element_class}"
  >
    <img
      src={image.src}
      alt={image.name}
      class="max-w-16 max-h-16 w-auto h-auto mx-auto border-1 border-white"
    />

    <span class="text-white text-center text-wrap">{image.name}</span>
  </button>
{/snippet}

{#snippet dirSnippet(dir: VirtualDir)}
  <button
    onclick={() =>
      (viewing_dir = viewing_dir.getChild(
        viewing_dir.getName() + "/" + dir.getName()
      ))}
    class="folder-button {selected_name === dir.name
      ? 'bg-slate-800 border-2 border-white'
      : ''} {element_class}"
  >
    <img
      class={icon_class}
      src="/icons/closed_folder.svg"
      alt="Closed Folder Icon"
    />
    <img
      class={icon_class}
      src="/icons/open_folder.svg"
      alt="Open Folder Icon"
    />
    <span class={name_class}>{dir.getName()}</span>
  </button>
{/snippet}

<div>
  <div class="break-words bg-slate-800 w-fit px-1 rounded select-none">
    {#each viewing_dir.address.split("/") as dir_name, index}
      {#if dir_name}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        /<span
          onclick={() => {
            viewing_dir = root.getChild(
              viewing_dir.address
                .split("/")
                .splice(0, index + 1)
                .join("/")
            );
            selected_name = "";
          }}
          class="hover:underline">{dir_name}</span
        >
      {/if}
    {/each}
  </div>

  <div class="grid grid-cols-[repeat(auto-fit,minmax(108px,1fr))] pt-1">
    {#each viewing_dir.dirs as dir}
      {@render dirSnippet(dir)}
    {/each}

    {#each viewing_dir.images as image}
      {@render imgSnippet(image)}
    {/each}

    <div class="{element_class} grid grid-cols-1 grid-rows-1 justify-center">
      <input
        onchange={(e) => {
          const files = e.target.files;
          if (!files || files.length === 0) return;
          let non_image_files = false;
          for (let file of files) {
            if (!file.type.startsWith("image/")) {
              non_image_files = true;
              continue;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
              root.importImage(event.target.result);
              viewing_dir = root.getChild(
                root.getName() + "/" + IMPORTS_FOLDER_NAME
              );
            };
            reader.readAsDataURL(file);
          }
          if (non_image_files) {
            console.log(
              "Some of the provided files are not images. This message should be changed form something actually in the ui"
            );
          }
        }}
        type="file"
        multiple
        class="row-start-1 col-start-1 w-full h-full opacity-0"
      />
      <img
        class="row-start-1 col-start-1 self-center {icon_class}"
        src="/icons/plus.svg"
        alt="Add File Icon"
      />
    </div>

    <!-- To ensure last row is on the left -->
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
  <div class="w-fit m-auto mt-2">
    {#if setImgSrc}
      <button
        disabled={selected_name === ""}
        onclick={() =>
          setImgSrc(
            viewing_dir.getChild(viewing_dir.getName() + "/" + selected_name)
              .src
          )}
        class={dialog_button_class}
      >
        Select Image
      </button>
    {/if}

    {#if cancelFn}
      <button onclick={cancelFn} class={dialog_button_class}> Cancel </button>
    {/if}
  </div>
</div>

<style>
  .folder-button img:nth-child(1) {
    display: block;
  }

  .folder-button img:nth-child(2) {
    display: none;
  }

  .folder-button:hover img:nth-child(1) {
    display: none;
  }

  .folder-button:hover img:nth-child(2) {
    display: block;
  }
</style>
