import {useAuth} from "../composables/useAuth";
import {toast} from "vue-sonner";
export default defineNuxtRouteMiddleware(async (to, from) => {
  const runtimeConfig = useRuntimeConfig();
  const isAuth = useAuth();

  // skip middleware on server
  if (import.meta.server) return;
  // skip middleware on client side entirely
  //if (import.meta.client) return
  // or only skip middleware on initial client load
  //const nuxtApp = useNuxtApp()
  //if (import.meta.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) return
  if (runtimeConfig.public.staticMode) {
    const session = useCookie("session");
    if (!session.value && to.path == "/login") return;
    else if (to.path == "/login") return navigateTo({path: "/"});
    if ((!session || !session.value) && !runtimeConfig?.public?.bypassList?.includes(to.path)) {
      isAuth.value = false
      toast.error("Authentication Required ");
      throw createError({statusCode: 401, statusMessage: "Unauthorized"});
    }
    if(session.value){
      isAuth.value = true
    }
    
  }


  const {data, error} = await useFetch("/api/session", {server: false, baseURL: runtimeConfig.public.apiBase});

  if (error.value && to.path == "/login") return;
  else if (data.value && to.path == "/login") return navigateTo({path: "/"});

  if ((!data || !data.value || !data.value.user.id) && !runtimeConfig?.public?.bypassList?.includes(to.path)) {
    toast.error("Authentication Required ");
    throw createError({statusCode: 401, statusMessage: "Unauthorized"});
  }
  if (data.value) {
    isAuth.value = true;
  }
});
