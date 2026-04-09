import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import '../src/css/natca-tokens.css'
import '../src/css/natca-components.css'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'
import { router } from './router'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'natcaDark',
    themes: {
      natcaDark: {
        dark: true,
        colors: {
          primary: '#CE0E2D',
          secondary: '#003366',
          accent: '#6AC9FF',
          background: '#0a0f1a',
          surface: '#111825',
          'on-primary': '#FFFFFF',
          'on-secondary': '#FFFFFF',
          'on-background': '#FFFFFF',
          'on-surface': '#FFFFFF',
        },
      },
    },
  },
})

const app = createApp(App)
app.use(vuetify)
app.use(router)
app.mount('#app')
