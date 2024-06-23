<script setup>
import {toast} from "vue-sonner";

const config = useRuntimeConfig();
const url = useRequestURL();
const router = useRouter();

const {data: hooks} = await getHooks();

const isSending = ref(false);
const isMakingPDF = ref(false);
const isSplitingPDF = ref(false);
const isConvertImgsToWebp = ref(false);

const pdfFileName = ref("");
const selectedPdf = ref("");

const hook_url = ref("");
const files = ref([]);
const hookJson = ref({
  username: "",
  avatar_url: "",
  content: "<p>Hello world!</p>",
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

async function submitHandler() {
  const url = hooks?.value?.hooks?.filter((i) => {
    return i.name + "-" + i.id == hook_url.value;
  });
  isSending.value = true;
  if (url && url[0] && url[0].link) {
    await sendToProxyD(url[0].link, hookJson.value, files.value);
  } else if (hook_url && hook_url.value) {
    await sendToProxyD(hook_url.value, hookJson.value, files.value);
  }
  isSending.value = false;
}

function addEmbed(embed) {
  if (hookJson?.value?.embeds?.length > 9) {
    toast.warning("Embeds limit at 10 embeds");
    return;
  }
  if (!hookJson?.value?.embeds) hookJson.value.embeds = [];
  hookJson.value.embeds.push(
    embed
      ? JSON.parse(JSON.stringify(embed))
      : {
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
          fields: [],
          footer: {
            text: "",
            icon_url: "",
          },
          timestamp: "",
          thumbnail: {
            url: "",
          },
        }
  );
}

function addField(embed, field) {
  if (embed?.fields?.length > 24) {
    toast.warning("Fields limit at 25 fileds");
    return;
  }
  embed?.fields.push(field ? JSON.parse(JSON.stringify(field)) : {name: "", value: "", inline: false});
}

function move(id, values, type) {
  let hold = values?.splice(id, 1);
  let hold2 = values?.splice(type == "up" ? id - 1 : id + 1);
  return [...values, ...hold, ...hold2];
}
async function allImagesToWebpHandler() {
  isConvertImgsToWebp.value = true;
  files.value = [].concat(await allImagesToWebp(files.value));
  isConvertImgsToWebp.value = false;
}
</script>

<template>
  <div class="p-6">
    <v-row no-gutters class="h-full">
      <v-col order="2" cols="12" md="6">
        <div class="flex flex-col gap-6 md:pr-4">
          <div class="flex gap-2 items-center">
            <v-combobox variant="outlined" color="primary" v-model="hook_url" hide-details density="compact" label="Hook" class="bg-component-background" :items="hooks ? hooks.hooks.map((i) => i.name + '-' + i.id) : []"></v-combobox>
            <v-btn :loading="isSending" prepend-icon="mdi-send" @click="submitHandler" variant="flat" color="primary">Send</v-btn>
          </div>

          <v-divider></v-divider>

          <!--
          <v-textarea color="primary" density="compact" :label="'Content (' + hookJson?.content?.length + '/2000)'" maxlength="2000" variant="outlined" hide-details class="bg-component-background" v-model="hookJson.content"></v-textarea>
          -->
          <Editor :title="'Content (' + turndownService.turndown(hookJson?.content)?.length + '/2000)'" v-model="hookJson.content"></Editor>

          <v-expansion-panels border color="background" variant="accordion" multiple>
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

          <div id="file" class="flex gap-2 items-center">
            <v-file-input
              show-size
              @click:clear="() => (files = [])"
              @update:modelValue="
                (nf) => {
                  files = files.concat(nf);
                  if (config.public.alwayMakeImageToWebp) allImagesToWebpHandler();
                }
              "
              chips
              :model-value="files"
              multiple
              label="File input"
              color="primary"
              density="compact"
              variant="outlined"
              hide-details
            ></v-file-input>
            <v-btn
              variant="flat"
              prepend-icon="mdi-clipboard-file"
              @click="
                async () => {
                  const nfile = await getFileFromClipboard();
                  if (nfile) files.push(nfile);
                  if (config.public.alwayMakeImageToWebp) allImagesToWebpHandler();
                }
              "
            >
              Clipboard
            </v-btn>
          </div>

          <v-divider></v-divider>

          <v-sheet class="bg-background-tertiary" rounded border :elevation="2">
            <div class="p-4 flex flex-col gap-4">
              <div class="flex gap-2 items-center">
                <v-btn
                  :loading="isMakingPDF"
                  @click="
                    async () => {
                      const whereFileIsImage = files.findIndex((v) => v?.type == 'image/png' || v?.type == 'image/jpg');
                      if (!files || whereFileIsImage == -1) {
                        toast.warning('Support only .jpg and .png file');
                        return;
                      }
                      isMakingPDF = true;
                      files.push(await generatePDFFromImage(files, pdfFileName || files[whereFileIsImage].name));
                      pdfFileName = files[whereFileIsImage].name;
                      isMakingPDF = false;
                    }
                  "
                  prepend-icon="mdi-file-pdf-box"
                  variant="flat"
                  color="success"
                >
                  ALL Image To pdf
                </v-btn>
                <v-text-field label="PDF file name" color="success" density="compact" variant="outlined" hide-details class="bg-background-tertiary" v-model="pdfFileName"></v-text-field>
              </div>
              <div class="flex gap-2 items-center">
                <v-select variant="outlined" color="success" v-model="selectedPdf" hide-details density="compact" label="Select pdf to split" class="bg-background-tertiary" :items="files?.length > 0 ? files?.filter((f) => f?.type == 'application/pdf' && convertFileSize(f?.size, 'MB') > 24).map((f) => f?.name) : []"></v-select>

                <v-btn
                  @click="
                    async () => {
                      isSplitingPDF = true;
                      if (selectedPdf) files = files.concat(await splitPDF(files.find((f) => f.name == selectedPdf)).catch(() => toast.error('Error : File not found')));
                      isSplitingPDF = false;
                    }
                  "
                  :loading="isSplitingPDF"
                  prepend-icon="mdi-content-cut"
                  variant="flat"
                  color="success"
                >
                  Splite PDF
                </v-btn>
              </div>

              <div class="flex gap-2 items-center">
                <v-btn
                  v-if="!config.public.alwayMakeImageToWebp"
                  @click="
                    async () => {
                      allImagesToWebpHandler();
                    }
                  "
                  :loading="isConvertImgsToWebp"
                  prepend-icon="mdi-image-multiple"
                  variant="flat"
                  color="success"
                  class="w-full"
                >
                  All to webp
                </v-btn>
              </div>
            </div>
          </v-sheet>

          <v-divider></v-divider>

          <div class="embed-editors flex flex-col gap-2">
            <div v-for="(_, i) in hookJson?.embeds">
              <EmbedEditor
                @clone-sync="
                  (obj) => {
                    hookJson.embeds.push(obj);
                  }
                "
                @clone="addEmbed"
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
                      hookJson.embeds = move(id, hookJson.embeds, 'up');
                    }
                  }
                "
                @move:down="
                  (id) => {
                    hookJson.embeds = move(id, hookJson.embeds, 'down');
                  }
                "
                @add:field="addField"
                @delete:field="
                  (id) => {
                    hookJson.embeds[i].fields?.splice(id, 1);
                  }
                "
                @clone:field="addField"
                @move:up:field="
                  (id) => {
                    if (id > 0) {
                      hookJson.embeds[i].fields = move(id, hookJson.embeds[i]?.fields, 'up');
                    }
                  }
                "
                @move:down:field="
                  (id) => {
                    hookJson.embeds[i].fields = move(id, hookJson.embeds[i]?.fields, 'down');
                  }
                "
              />
            </div>
            <div class="">
              <v-btn prepend-icon="mdi-comment-plus" :disabled="hookJson?.embeds?.length > 9" @click="() => addEmbed()" color="primary" variant="flat">Add Embed</v-btn>
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
              <Preview :avatarURL="hookJson?.avatar_url?.length > 6 ? hookJson?.avatar_url : null" :username="hookJson.username" :content="hookJson.content">
                <div class="flex flex-col gap-2">
                  <div class="w-fit" v-for="(embed, i) in hookJson.embeds">
                    <Embed
                      :data="embed"
                      @delete="
                        () => {
                          hookJson.embeds.splice(i, 1);
                        }
                      "
                    />
                  </div>
                  <div v-for="(file, i) in files">
                    <File
                      v-if="!isConvertImgsToWebp"
                      @delete="
                        () => {
                          files.splice(i, 1);
                        }
                      "
                      :data="file"
                    />
                    <v-skeleton-loader v-else type="image"></v-skeleton-loader>
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
