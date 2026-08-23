import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'unxd1ije',
    dataset: 'production'
  },
  typegen: {
    path: '../../nextjs/lib/blog.ts',
    schema: './schema.json',
    generates: '../../nextjs/types/sanity.types.ts',
    overloadClientMethods: true,
  },
  deployment: {
    appId: 'yzsls8imau8dvpulgqab7hbo',
    // Keep production Studio on the version tested and committed in package.json.
    autoUpdates: false,
  }
})
