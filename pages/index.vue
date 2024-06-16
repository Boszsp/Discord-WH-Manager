<script setup>
const config = useRuntimeConfig();
const url = useRequestURL();
const router = useRouter();

const {data: hooks} = await getHooks();

const hook_url = ref("");
const files = ref([]);
const hookJson = ref({
  username: "",
  avatar_url: "",
  content: "<p>Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.</p>",
  embeds: [],
  thread_name: "",
});
if (config.public.paramDataMode) {
  onBeforeMount(() => {
    if (url.searchParams.get("d")) {
      try {
        decodeURIComponent(window.atob(url.searchParams.get("d")));
        Object.assign(hookJson.value, JSON.parse(decodeURIComponent(window.atob(url.searchParams.get("d")))));
      } catch {}
    }
  });
  watch(hookJson.value, (n) => {
    router.push({query: {d: window.btoa(encodeURIComponent(JSON.stringify(n)))}});
  });
}

function submitHandler() {
  const url = hooks?.value?.hooks?.filter((i) => {
    return i.name + "-" + i.id == hook_url.value;
  });
  if (url && url[0] && url[0].link) {
    sendToProxyD(url[0].link, hookJson.value, files.value);
  } else if (hook_url && hook_url.value) {
    sendToProxyD(hook_url.value, hookJson.value, files.value);
  }
}

function addEmbed() {
  if (!hookJson?.value?.embeds) hookJson.value.embeds = [];
  hookJson.value.embeds.push({
    avatar_url: "",
    color: "#5864f2",
    author: {
      name: "",
      url: "",
      icon_url: "",
    },
    title: "",
    description: "",
    image: {
      url: "",
    },
    footer: {
      text: "",
      icon_url: "",
      timestamp: "",
    },
    thumbnail: {
      url: "",
    },
  });
}
</script>

<template>
  <div class="p-6">
    <v-row no-gutters class="h-full">
      <v-col order="2" cols="12" md="6">
        <div class="flex flex-col gap-6 md:pr-4">
          <div class="flex gap-2 items-center">
            <v-combobox variant="outlined" color="primary" v-model="hook_url" hide-details density="compact" label="Hook" class="bg-component-background" :items="hooks ? hooks.hooks.map((i) => i.name + '-' + i.id) : []"></v-combobox>
            <v-btn @click="submitHandler" variant="flat" color="primary">Send</v-btn>
          </div>

          <v-divider></v-divider>

          <!--
          <v-textarea color="primary" density="compact" :label="'Content (' + hookJson?.content?.length + '/2000)'" maxlength="2000" variant="outlined" hide-details class="bg-component-background" v-model="hookJson.content"></v-textarea>
          -->
          <Editor :title="'Content (' + turndownService.turndown(hookJson?.content)?.length + '/2000)'" v-model="hookJson.content"></Editor>

          <v-expansion-panels color="background" variant="accordion" multiple>
            <v-expansion-panel title="Profile">
              <v-expansion-panel-text class="bg-background">
                <v-text-field :label="'Username (' + hookJson?.username?.length + '/80)'" maxlength="80" color="primary" density="compact" variant="outlined" hide-details class="bg-component-background mb-6" v-model="hookJson.username"></v-text-field>
                <v-text-field label="Avatar URL" color="primary" density="compact" variant="outlined" hide-details class="bg-component-background" v-model="hookJson.avatar_url"></v-text-field>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel title="Thread">
              <v-expansion-panel-text class="bg-background">
                <v-text-field :label="'Thread Name (' + hookJson?.thread_name?.length + '/100)'" maxlength="80" color="primary" density="compact" variant="outlined" hide-details class="bg-component-background mb-6" v-model="hookJson.thread_name"></v-text-field>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <div class="flex gap-2 items-center">
            <v-file-input @click:clear="() => (files = [])" @update:modelValue="(nf) => (files = files.concat(nf))" chips :model-value="files" multiple label="File input" color="primary" density="compact" variant="outlined" hide-details></v-file-input>
            <v-btn
              variant="flat"
              @click="
                async () => {
                  const nfile = await getFileFromClipboard();
                  if (nfile) files.push(nfile);
                }
              "
            >
              Clipboard
            </v-btn>
          </div>
          <v-divider></v-divider>

          <div class="embed-editors">
            <div class="mt-2" v-for="(_, i) in hookJson?.embeds">
              <EmbedEditor
                @clone-sync="
                  (obj) => {
                    hookJson.embeds.push(obj);
                  }
                "
                @clone="
                  (obj) => {
                    hookJson.embeds.push(JSON.parse(JSON.stringify(obj)));
                  }
                "
                @delete="
                  (id) => {
                    hookJson.embeds.splice(id, 1);
                  }
                "
                :id="i"
                v-model="hookJson.embeds[i]"
                @move:up="
                  (id) => {
                    if (id > 0) {
                      let hold = hookJson.embeds.splice(id, 1);
                      let hold2 = hookJson.embeds.splice(id - 1);
                      hookJson.embeds = [...hookJson.embeds, ...hold, ...hold2];
                    }
                  }
                "
                @move:down="
                  (id) => {
                    let hold = hookJson.embeds.splice(id, 1);
                    let hold2 = hookJson.embeds.splice(id + 1);
                    hookJson.embeds = [...hookJson.embeds, ...hold, ...hold2];
                  }
                "
              />
            </div>
            <div :class="hookJson?.embeds?.length > 0 ? 'mt-6' : ''">
              <v-btn :disabled="hookJson?.embeds?.length > 9" @click="addEmbed" color="primary" variant="flat">Add Embed</v-btn>
            </div>
          </div>

          <v-divider></v-divider>
          <v-textarea rows="3" label="VALUE PREVIEW" auto-grow variant="outlined" bg-color="background-tertiary" flat readonly :model-value="JSON.stringify(hookJson, undefined, 4)"></v-textarea>
        </div>
      </v-col>
      <v-spacer></v-spacer>

      <v-col order="1" order-md="2" cols="12" md="6" class="relative lg:top-0">
        <div class="h-full lg:fixed lg:overflow-y-auto lg:top-0 lg:pt-14 w-full p-4">
          <div class="max-lg:mb-8 w-full">
            <v-sheet class="bg-transparent lg:p-4 lg:w-6/12">
              <Preview :avatarURL="hookJson?.avatar_url?.length > 6 ? hookJson?.avatar_url : null" :username="hookJson?.username" :content="hookJson?.content">
                <div class="flex flex-col gap-2">
                  <div class="w-fit" v-for="embed in hookJson.embeds">
                    <Embed :data="embed" />
                  </div>
                  <div v-for="(file, i) in files">
                    <File
                      @delete="
                        () => {
                          files.splice(i, 1);
                        }
                      "
                      :data="file"
                    />
                  </div>
                </div>
              </Preview>
            </v-sheet>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
