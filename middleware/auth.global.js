import { useAuth } from "../composables/useAuth"
import { toast } from 'vue-sonner'
export default defineNuxtRouteMiddleware(async (to,from) => {
    const runtimeConfig = useRuntimeConfig();
    // skip middleware on server
    if (import.meta.server) return
    // skip middleware on client side entirely
    //if (import.meta.client) return
    // or only skip middleware on initial client load
    //const nuxtApp = useNuxtApp()
    //if (import.meta.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) return
    const {data,error} = await useFetch("/api/session",{server:false})
  
    if(error.value && to.path == "/login")return
    else if(data.value && to.path == "/login")return navigateTo({path:"/"})

    if((!data || !data.value || !data.value.user.id) && !runtimeConfig?.public?.bypassList?.includes(to.path)){
      toast.error('Authentication Required ')
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    } 
    if(data.value){
      const isAuth = useAuth()
      isAuth.value = true
    }
    
  })
  