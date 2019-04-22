export default interface CacheIntl<T extends any> {
  get(key: string): T
  set(key: string, value: T): void
  has(key: string): boolean
}