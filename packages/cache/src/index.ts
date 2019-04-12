import CacheIntl from '@blued-core/cache-intl'

export default class Cache implements CacheIntl {
  private cache = new Map()

  get(key: string) {
    return this.cache.get(key)
  }

  set(key: string, value: any) {
    this.cache.set(key, value)
  }

  has(key: string) {
    return this.cache.has(key)
  }
}