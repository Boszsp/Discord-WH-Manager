<script setup>
import hljs from "highlight.js";
import "highlight.js/styles/github-dark-dimmed.min.css";
const props = defineProps({
  title: String,
  readonly: Boolean,
});

const model = defineModel();
const string = defineModel("string");
const model_hold = ref(Object.assign({}, model.value || {}));
const isEditing = ref(false);

function onInputHandler(e) {
  const {success, data} = safeParseJson(e.target.innerText);
  if (success && data) {
    if (model.value) model.value = data;
    else if (string.value) string.value = JSON.stringify(data, null, 4);
  }
}
</script>
<template>
  <div>
    <p class="text-sm opacity-70">{{ props.title }}</p>
    <pre
      :contenteditable="!readonly"
      @focusin="
        () => {
          model_hold = Object.assign({}, model || safeParseJson(string).data || {});
          isEditing = true;
        }
      "
      @focusout="
        () => {
          isEditing = false;
        }
      "
      @input="onInputHandler"
      class="bg-background-tertiary rounded p-5 overflow-hidden whitespace-break-spaces"
    ><code v-html="hljs.highlight((!isEditing && string) ? string : JSON.stringify(isEditing ? model_hold : model ?? '{}',undefined,4),{language:'json'}).value" ></code></pre>
  </div>
</template>
