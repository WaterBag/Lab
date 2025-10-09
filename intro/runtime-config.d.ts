declare module 'nuxt/schema' {
  interface RuntimeConfig {

  }
  interface PublicRuntimeConfig {
    /** 运行时环境变量注入值，不允许修改 */
    readonly HOST_ENV: HostEnvType
  }
}

// It is always important to ensure you import/export something when augmenting a type
export {}
