"use client"

//We could have simply wrapped our entire app with <SessionProvider> in the layout.tsx, but it doesn't work on server components. We could have used the keyword "use client" for only it, but many components have not added that functionality in nextjs yet. Hence why we have this file.


export {SessionProvider as default} from "next-auth/react"