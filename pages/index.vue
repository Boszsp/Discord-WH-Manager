<script setup>
const {data: hooks} = useFetch("/api/hooks");

const hook_url = ref("");
const files = ref(null);
const hookJson = ref({
  username: "",
  avatar_url: "",
  content: "ไลน์ เอาท์ดอร์มาร์เก็ตติ้งแยมโรล ราสเบอร์รีไลท์ภูมิทัศน์",
  embeds: [],
  files: [],
});

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
            <v-btn @click="submitHandler" variant="outlined" color="primary">Send</v-btn>
          </div>

          <v-divider></v-divider>

          <v-textarea color="primary" density="compact" :label="'Content (' + hookJson?.content?.length + '/2000)'" maxlength="2000" variant="outlined" hide-details class="bg-component-background" v-model="hookJson.content"></v-textarea>

          <v-expansion-panels color="background" variant="accordion">
            <v-expansion-panel title="Profile">
              <v-expansion-panel-text class="bg-background">
                <v-text-field :label="'Username (' + hookJson?.username?.length + '/80)'" maxlength="80" color="primary" density="compact" variant="outlined" hide-details class="bg-component-background mb-6" v-model="hookJson.username"></v-text-field>
                <v-text-field label="Avatar URL" color="primary" density="compact" variant="outlined" hide-details class="bg-component-background" v-model="hookJson.avatar_url"></v-text-field>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-file-input chips v-model="files" multiple label="File input" color="primary" density="compact" variant="outlined" hide-details></v-file-input>

          <v-divider></v-divider>

          <div class="embed-editors">
            <div class="mt-2" v-for="(_, i) in hookJson?.embeds">
              <EmbedEditor
                @syncClone="
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
              />
            </div>
            <div class="mt-6">
              <v-btn @click="addEmbed" color="primary" variant="flat">Add Embed</v-btn>
            </div>
          </div>
        </div>
      </v-col>
      <v-spacer />
      <v-col order="1" order-md="2" cols="12" md="6">
        <div class="max-lg:mb-8 lg:pl-4">
          <v-sheet border class="bg-transparent p-4" rounded>
            <Preview :avatarURL="hookJson?.avatar_url?.length > 6 ? hookJson?.avatar_url : null" :username="hookJson?.username" :content="hookJson?.content">
              <div class="flex flex-col gap-2">
                <div class="w-fit" v-for="embed in hookJson.embeds">
                  <Embed :data="embed" />
                </div>
                <div v-for="file in files">
                  <File :data="file" />
                </div>
              </div>
            </Preview>
          </v-sheet>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
