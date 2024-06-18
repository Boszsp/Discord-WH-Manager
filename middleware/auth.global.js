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
    const session_hash = useCookie("session_hash")
    
    console.log(session_hash.value)
  
    if(!session_hash.value && to.path == "/login")return
    else if(session_hash.value && to.path == "/login")return navigateTo({path:"/"})

    if((!session_hash.value) && !runtimeConfig?.public?.bypassList?.includes(to.path)){
      toast.error('Authentication Required ')
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    } 
    if(session_hash.value){
      const isAuth = useAuth()
      isAuth.value = true
    }
    
  })
  