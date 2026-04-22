import {defineConfig} from 'sanity'
import {table} from '@sanity/table'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {mainDocuments, postLocations} from './presentation/resolve'

const previewOrigin =
  process.env.SANITY_STUDIO_PREVIEW_ORIGIN || 'http://localhost:3000'

export default defineConfig({
  name: 'default',
  title: 'RealismThrift',

  projectId: 'unxd1ije',
  dataset: 'production',

  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: {
        initial: `${previewOrigin}/blog`,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      allowOrigins: ['http://localhost:3000', 'https://www.realismthrift.com'],
      resolve: {
        mainDocuments,
        locations: {
          post: postLocations,
        },
      },
    }),
    visionTool(),
    table(),
  ],

  schema: {
    types: schemaTypes,
  },
})
