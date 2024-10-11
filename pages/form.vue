<script setup>
import {toast} from "vue-sonner";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark-dimmed.min.css";
import {z} from "zod";

const config = useRuntimeConfig();
const {data: hooks} = await getHooks();

const route = useRoute();
const id = route.query?.id;
const json_query = route.query?.json;

const templateString = ref(json_query ? decodeURI(json_query) : null);

const hook_url = ref("");
const files = ref([]);
const hookJson = ref({
  username: "",
  avatar_url: "",
  content: "<p></p>",
  embeds: [],
  thread_name: "",
});

const isSending = ref(false);
const isMakingPDF = ref(false);
const isSplitingPDF = ref(false);
const isConvertImgsToWebp = ref(false);
const isRemoveSource = ref(false);
const isSendImagesMode = ref(false);
const isFixedSizePdfPages = ref(false);
const isRequireAll = ref(true);

const pdfFileName = ref("");
const selectedPdf = ref("");
const avgSplitPdfSize = ref(20);
const webpImgQuality = ref(95);

const formFields = ref({});
const formFieldsTextArea = ref({});

async function submitHandler() {
  const url = hooks?.value?.hooks?.filter((i) => {
    return i.name + "-" + i.id == hook_url.value;
  });
  isSending.value = true;

  if (isRequireAll.value) {
    const requiredString = z.string({required_error: "required"}).min(1, " >= 1 length is required");
    for (let i in formFields.value) {
      const {success, data, error} = requiredString.safeParse(formFields.value[i]);
      if (!success) {
        toast.error(i + " " + error.formErrors.formErrors.join(""));
        isSending.value = false;
        return false;
      }
    }
  }

  if (url && url[0] && url[0].link) {
    await sendToProxyD(url[0].link, hookJson.value, files.value, isSendImagesMode.value);
  } else if (hook_url && hook_url.value) {
    await sendToProxyD(hook_url.value, hookJson.value, files.value, isSendImagesMode.value);
  }
  isSending.value = false;
}

async function allImagesToWebpHandler() {
  isConvertImgsToWebp.value = true;
  files.value = [].concat(await allImagesToWebp(files.value, webpImgQuality.value));
  isConvertImgsToWebp.value = false;
}

function fillHookJson() {
  hookJson.value = Object.assign(hookJson.value, safeParse(renderTemplate(templateString.value, formFields.value)));
}

function sortedHooks() {
  return hooks?.value?.hooks?.sort((a, b) => {
    let comprare = 0;
    a?.name?.split("")?.forEach((i, ii) => {
      if (comprare !== 0) return;
      comprare = i?.toUpperCase()?.charCodeAt() - b?.name?.split("")[ii]?.toUpperCase()?.charCodeAt();
    });
    return comprare;
  });
}

onNuxtReady((_) => {
  if (!templateString.value) templateString.value = getTemplateFromId(id);

  templateString.value = JSON.stringify(safeParse(templateString.value), undefined, 4);

  formFields.value = getAllVariable(templateString.value);
  fillHookJson();

  Object.keys(hookJson.value).forEach((k) => {
    formFieldsTextArea.value[k] = false;
  });
  watch(formFields.value, (_) => {
    fillHookJson();
  });
  watch(templateString, (_) => {
    fillHookJson();
  });
});
</script>
<template>
  <div class="p-6">
    <v-row no-gutters class="h-full">
      <v-col order="2" cols="12" md="6">
        <div class="flex flex-col gap-6 md:pr-4">
          <div class="flex gap-2 items-center">
            <v-combobox variant="outlined" color="primary" v-model="hook_url" hide-details density="compact" label="Hook" class="bg-component-background" :items="hooks ? sortedHooks().map((i) => i.name + '-' + i.id) : []"></v-combobox>
            <v-btn :loading="isSending" prepend-icon="mdi-send" @click="submitHandler" variant="flat" color="primary">Send</v-btn>
          </div>

          <v-divider></v-divider>

          <div v-for="(_, title) in formFields" :class="'items-center h-full gap-1 overflow-hidden ' + (formFieldsTextArea[title] ? '' : 'flex')">
            <v-btn @click="(_) => (formFieldsTextArea[title] = !formFieldsTextArea[title])" :elevation="0" :color="isRequireAll && formFields[title]?.length == 0 ? 'danger' : 'primary'" class="'h-full p-2 px-3 bg-primary/50" hide-details :block="formFieldsTextArea[title]">{{ title + (isRequireAll ? "*" : "") }}</v-btn>
            <v-textarea counter v-if="formFieldsTextArea[title]" v-model="formFields[title]" density="compact" hide-details clearable flat rounded class="bg-background-tertiary" variant="solo"></v-textarea>
            <v-text-field counter v-else v-model="formFields[title]" type="text" density="compact" hide-details clearable flat rounded class="bg-background-tertiary" variant="solo"></v-text-field>
          </div>
          <v-switch v-model="isRequireAll" color="primary" inset hide-details label="Required All"></v-switch>

          <v-divider></v-divider>

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

          <v-sheet rounded :elevation="1" class="w-full bg-background px-5">
            <div class="flex items-center gap-5">
              <v-btn
                @click="
                  () => {
                    hooks = getHooks().data;
                  }
                "
                prepend-icon="mdi-refresh"
                variant="flat"
              >
                Refresh Hooks
              </v-btn>
              <v-switch v-model="isSendImagesMode" color="primary" inset hide-details label="Sent Images Only Mode"></v-switch>
            </div>
          </v-sheet>

          <v-divider></v-divider>

          <v-sheet class="bg-background-tertiary" rounded border :elevation="2">
            <div class="p-4 flex flex-col gap-4">
              <div class="flex gap-2 items-center">
                <v-btn
                  :loading="isMakingPDF"
                  @click="
                    async () => {
                      const whereFileIsImage = files.findIndex((v) => v?.type == 'image/png' || v?.type == 'image/jpeg' || v?.type == 'image/jpg');
                      if (!files || whereFileIsImage == -1) {
                        toast.warning('Support only .jpg and .png file');
                        return;
                      }
                      isMakingPDF = true;
                      files.push(await generatePDFFromImage(files, pdfFileName || files[whereFileIsImage].name, isFixedSizePdfPages));
                      if (isRemoveSource) files = files.filter((file) => !(file.type == 'image/png' || file.name.toLowerCase().endsWith('.jpg')));
                      if (!pdfFileName) pdfFileName = files[whereFileIsImage].name;
                      isMakingPDF = false;
                    }
                  "
                  prepend-icon="mdi-file-pdf-box"
                  variant="flat"
                  color="success"
                >
                  Images To pdf
                </v-btn>
                <v-tooltip text="Remove Source" location="top">
                  <template v-slot:activator="{props}">
                    <v-checkbox v-bind="props" v-model="isRemoveSource" hide-details label=""></v-checkbox>
                  </template>
                </v-tooltip>
                <v-tooltip text="Fixed PDF Pages Size From Frist Page" location="top">
                  <template v-slot:activator="{props}">
                    <v-checkbox v-bind="props" v-model="isFixedSizePdfPages" hide-details label=""></v-checkbox>
                  </template>
                </v-tooltip>
                <v-text-field label="PDF file name" color="success" density="compact" variant="outlined" hide-details class="bg-background-tertiary" v-model="pdfFileName"></v-text-field>
              </div>
              <div class="flex gap-2 items-center">
                <v-select variant="outlined" color="success" v-model="selectedPdf" hide-details density="compact" label="Select pdf to split" class="bg-background-tertiary w-6/12" :items="files?.length > 0 ? files?.filter((f) => f?.type == 'application/pdf' && convertFileSize(f?.size, 'MB') > 24).map((f) => f?.name) : []"></v-select>
                <v-text-field min="1" type="number" label="AVG split PDF size" color="success" density="compact" variant="outlined" hide-details class="bg-background-tertiary w-3/12" v-model="avgSplitPdfSize"></v-text-field>
                <v-btn
                  @click="
                    async () => {
                      isSplitingPDF = true;
                      if (selectedPdf)
                        files = files.concat(
                          await splitPDF(
                            files.find((f) => f.name == selectedPdf),
                            avgSplitPdfSize
                          ).catch(() => toast.error('Error : File not found'))
                        );
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
                  class="w-9/12"
                >
                  All to webp
                </v-btn>
                <v-text-field min="0" max="100" type="number" label="Quality" color="success" density="compact" variant="outlined" hide-details class="bg-background-tertiary w-3/12" v-model="webpImgQuality"></v-text-field>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <v-btn
                  v-if="!config.public.alwayMakeImageToWebp"
                  @click="
                    async () => {
                      files.forEach(async (f) => {
                        if (f.type.toUpperCase().endsWith('ZIP')) {
                          if (isRemoveSource) {
                            files = files.filter((file) => file.name != f.name);
                          }
                          (await extractZipFile(f)).sort((a, b) => (!(isNaN(parseInt(a.name)) || isNaN(parseInt(b.name))) || (a?.name?.search(/(\d+)\./) != -1 && b?.name?.search(/(\d+)\./) != -1) ? parseInt(a?.name?.match(/(\d+)\./)[1] || a.name) - parseInt(b?.name?.match(/(\d+)\./)[1] || b.name) : a.name < b.name ? -1 : 1)).forEach((file) => files.push(file));
                        }
                      });
                    }
                  "
                  prepend-icon="mdi-zip-box"
                  variant="flat"
                  color="success"
                  class="w-full"
                >
                  Unzip All
                </v-btn>

                <v-btn
                  v-if="!config.public.alwayMakeImageToWebp"
                  @click="
                    async () => {
                      files.push(await createZipFile(files, pdfFileName));
                    }
                  "
                  prepend-icon="mdi-folder-zip"
                  variant="flat"
                  color="success"
                  class="w-full"
                >
                  Zip All
                </v-btn>
              </div>
            </div>
          </v-sheet>

          <v-divider></v-divider>
          <EditorJson title="Base Template Preview" v-model:string="templateString"></EditorJson>
          <EditorJson readonly title="Value Preview" v-model="hookJson"></EditorJson>

          <v-btn flat @click="() => saveTemplate(parseInt(id), templateString)" prepend-icon="mdi-content-save">Save Template</v-btn>
        </div>
      </v-col>

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
                          if (files.length == 0) {
                            files = [];
                          }
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
