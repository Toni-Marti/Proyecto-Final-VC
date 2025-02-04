<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  onclick={(e) => e.stopPropagation()}
  class="absolute w-screen h-screen content-center z-20 bg-[#00000033] select-none"
>
  <div
    class="z-100 border-4 bg-slate-900 border-white rounded-4xl p-4 w-auto max-w-[80%] max-h-[90%] m-auto"
  >
    <slot />
  </div>
</div>
