import { postsopConfig } from '@postsop/eslint-config'

export default postsopConfig({
  tsconfigRootDir: import.meta.dirname,
  features: {
    reactNative: true,
  },
})
