<script setup>
import {toast} from "vue-sonner";

const pdfResult = ref(null);
const files = ref([]);
const pdfFileName = ref("");
const selectedPdf = ref("");
const avgSplitPdfSize = ref(20);
const preview_mode = ref(0);

const isLoading = ref(false);
const isRemoveSource = ref(false);
const isFixedSizePdfPages = ref(false);

const headers = [
  {title: "Icon", align: "start", key: "icon"},
  {title: "Name", align: "start", key: "name"},
  {title: "Size", align: "end", key: "size"},
  {title: "Type", align: "end", key: "type"},
  {title: "Action", align: "end", key: "action"},
];

function getFileUrl(f) {
  const objURL = URL.createObjectURL(f);
  setTimeout(() => URL.revokeObjectURL(objURL), 100);
  return objURL;
}

async function getFileBase64(f) {
  let res = "";
  await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(f);
    reader.onloadend = () => {
      res = reader.result;
      resolve(res.result);
    };
    reader.onerror = reject;
  });

  return await res;
}

function deleteFile(index) {
  files.value.splice(index, 1);
  if (files.value.length == 0) {
    files.value = [];
  }
}
</script>
<template>
  <v-sheet class="rounded-lg bg-component-background" :elevation="2" border rounded>
    <div class="p-4">
      <h6 class="text-h6">Files Tools 1</h6>
      <div class="flex items-center mt-4 gap-2">
        <v-file-input show-size @click:clear="() => (files = [])" @update:modelValue="(nf) => (files = files.concat(nf))" chips :model-value="files" multiple label="File input" color="primary" density="compact" variant="outlined" hide-details></v-file-input>
        <v-btn
          variant="flat"
          prepend-icon="mdi-clipboard-file"
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
      <div class="flex flex-wrap items-center gap-4 mt-4">
        <v-checkbox v-model="isRemoveSource" hide-details label="Remove Source"></v-checkbox>
        <v-tooltip text="Fixed PDF Pages Size Follow Frist Page Size" location="top">
          <template v-slot:activator="{props}">
            <v-checkbox v-bind="props" v-model="isFixedSizePdfPages" hide-details label="Fixed Pdf Pages Size"></v-checkbox>
          </template>
        </v-tooltip>
        <v-text-field label="PDF/ZIP file name" color="success" density="compact" variant="outlined" hide-details v-model="pdfFileName"></v-text-field>
        <v-btn
          :loading="isLoading"
          @click="
            async () => {
              const whereFileIsImage = files.findIndex((v) => v?.type == 'image/png' || v?.type == 'image/jpeg' || v?.type == 'image/jpg');
              if (!files || whereFileIsImage == -1) {
                toast.warning('Support only .jpg and .png file');
                return;
              }
              isLoading = true;
              files.push(await generatePDFFromImage(files, pdfFileName || files[whereFileIsImage].name, isFixedSizePdfPages));
              if (isRemoveSource) files = files.filter((file) => !(file.type == 'image/png' || file.name.toLowerCase().endsWith('.jpg')));
              if (!pdfFileName) pdfFileName = files[whereFileIsImage].name;
              isLoading = false;
            }
          "
          prepend-icon="mdi-file-pdf-box"
          variant="flat"
          color="success"
        >
          Images To pdf
        </v-btn>
      </div>
      <div class="flex flex-wrap gap-2 items-center mt-4">
        <v-select variant="outlined" color="success" v-model="selectedPdf" hide-details density="compact" label="Select pdf to split" class="w-6/12" :items="files?.length > 0 ? files?.filter((f) => f?.type == 'application/pdf').map((f) => f?.name) : []"></v-select>
        <v-text-field min="1" type="number" label="AVG split PDF size" color="success" density="compact" variant="outlined" hide-details class="w-3/12" v-model="avgSplitPdfSize"></v-text-field>
        <v-btn
          @click="
            async () => {
              isLoading = true;
              if (selectedPdf)
                files = files.concat(
                  await splitPDF(
                    files.find((f) => f.name == selectedPdf),
                    avgSplitPdfSize
                  ).catch(() => toast.error('Error : File not found'))
                );
              isLoading = false;
            }
          "
          :loading="isLoading"
          prepend-icon="mdi-content-cut"
          variant="flat"
          color="success"
        >
          Splite PDF
        </v-btn>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
        <v-btn
          @click="
            async () => {
              let holds = [...files];
              let length = files.length;
              isLoading = true;
              files.forEach(async (f, ii) => {
                if (f.type.toUpperCase().endsWith('ZIP')) {
                  if (isRemoveSource) {
                    files = files.filter((file) => file.name != f.name);
                  }
                  try {
                    (await extractZipFile(f))
                      ?.sort((a, b) => sortingFileNameFn(a.name, b.name))
                      .forEach((file) => {
                        files.push(file);
                      });
                  } catch {
                    files = holds;
                    isLoading = false;
                    toast.error('Error : Failed to unzip ' + f.name + ' file');
                  }
                }
                if (length == ii + 1) {
                  isLoading = false;
                }
              });
            }
          "
          prepend-icon="mdi-zip-box"
          variant="flat"
          color="success"
          class="w-full"
          :loading="isLoading"
        >
          Unzip All
        </v-btn>

        <v-btn
          @click="
            async () => {
              let hold;
              isLoading = true;
              hold = await createZipFile(files, pdfFileName);
              if (isRemoveSource) {
                files = [hold];
              } else {
                files.push(hold);
              }
              isLoading = false;
            }
          "
          prepend-icon="mdi-folder-zip"
          variant="flat"
          color="success"
          class="w-full"
          :loading="isLoading"
        >
          Zip All
        </v-btn>
        <v-btn
          @click="
            async () => {
              let length = files.length;
              isLoading = true;
              [...files].forEach(async (file, ii) => {
                if (isRemoveSource && ii == 0) files = [];
                files.push(await encryptFile(file));
                if (length == ii + 1) {
                  isLoading = false;
                }
              });
            }
          "
          prepend-icon="mdi-lock"
          variant="flat"
          color="success"
          class="w-full"
          :loading="isLoading"
        >
          Encrypt
        </v-btn>
        <v-btn
          @click="
            async () => {
              let length = files.length;
              isLoading = true;
              [...files].forEach(async (file, ii) => {
                if (isRemoveSource && ii == 0) files = [];
                try {
                  files.push(await decryptFile(file));
                } catch {
                  //toast.error('Error : Failed to decrypt ' + file.name +'file');
                }
                if (length == ii + 1) {
                  isLoading = false;
                }
              });
            }
          "
          prepend-icon="mdi-lock-open"
          variant="flat"
          color="danger"
          class="w-full"
          :loading="isLoading"
        >
          Decrypt
        </v-btn>
      </div>

      <div class="flex items-center mt-4 gap-2">
        <p>Total File : {{ files.length }}</p>
        <v-btn-toggle v-model="preview_mode" mandatory>
          <v-btn size="x-small">
            <v-icon>mdi-grid-large</v-icon>
          </v-btn>
          <v-btn size="x-small">
            <v-icon>mdi-view-list</v-icon>
          </v-btn>
        </v-btn-toggle>
      </div>
      <iframe v-if="pdfResult" width="100%" height="600rem" :src="getFileUrl(pdfResult)"></iframe>

      <div v-if="preview_mode == 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:lg:grid-cols-6 w-full items-center gap-6">
        <span :elevation="2" class="h-48 w-48 overflow-hidden p-4" rounded v-for="(file, i) in files">
          <div class="flex h-36 overflow-hidden rounded hover:opacity-80 transition-opacity transition-2">
            <div class="relative bg-[#505256] w-full h-full flex justify-center" v-if="file.type.startsWith('image')">
              <img :src="getFileUrl(file)" alt="image" class="object-scale-down w-auto h-full" />
              <a
                class="absolute top-0 right-0 w-full h-full"
                @click="
                  () => {
                    navigateTo(getFileUrl(file), {
                      external: true,
                      open: {
                        target: '_blank',
                      },
                    });
                  }
                "
              ></a>
              <span class="absolute top-0 right-1">
                <v-btn @click="() => deleteFile(i)" density="compact" size="x-small" variant="text" icon="mdi-close" color="danger" class="p-2"></v-btn>
              </span>
            </div>
            <div class="relative flex justify-center h-30 w-full bg-[#505256] rounded overflow-hidden items-center" v-else>
              <v-btn variant="tonal" color hide-details size="x-large">
                <v-icon v-if="file?.type?.includes('pdf')">mdi-file-pdf-box</v-icon>
                <v-icon v-else>mdi-file</v-icon>
              </v-btn>
              <a
                class="absolute top-0 right-0 w-full h-full"
                @click="
                  () => {
                    navigateTo(getFileUrl(file), {
                      external: true,
                      open: {
                        target: '_blank',
                      },
                    });
                  }
                "
              ></a>
              <span class="absolute top-0 right-1">
                <v-btn @click="() => deleteFile(i)" density="compact" size="x-small" variant="text" icon="mdi-close" color="danger" class="p-2"></v-btn>
              </span>
            </div>
          </div>
          <p class="text-center truncate">{{ file.name }}</p>
        </span>
      </div>
      <div v-else>
        <v-data-table-virtual
          class="bg-component-background"
          color=""
          :headers="headers"
          :items="
            [].concat(files).map((f, i) => {
              return {name: f.name, type: f.type, size: convertFileSize(f.size, 'MB') + 'Mb', icon: f.type, action: {index: i, file: f}};
            })
          "
          height="400"
          item-value="name"
        >
          <template v-slot:item.icon="{value}">
            <v-icon>
              {{ value.includes("image") ? "mdi-image" : "mdi-file" }}
            </v-icon>
          </template>
          <template v-slot:item.action="{value}">
            <v-btn
              @click="
                () => {
                  navigateTo(getFileUrl(value?.file), {
                    external: true,
                    open: {
                      target: '_blank',
                    },
                  });
                }
              "
              class="mr-3"
              size="x-small"
              variant="flat"
              prepend-icon="mdi-open-in-new"
              color="primary"
            >
              Open
            </v-btn>
            <v-btn @click="() => deleteFile(value?.index)" size="x-small" variant="flat" prepend-icon="mdi-delete" color="danger">Delete</v-btn>
          </template>
        </v-data-table-virtual>
      </div>
      <div>
        <v-btn @click="() => deleteFile(value?.index)" size="small" class="mt-5" variant="flat" prepend-icon="mdi-export">Export To Other Section</v-btn>
      </div>
    </div>
  </v-sheet>
</template>
