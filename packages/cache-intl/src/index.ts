export default interface CacheIntl {
  get(key: string): any
  set(key: string, value: any): void
  has(key: string): boolean
}