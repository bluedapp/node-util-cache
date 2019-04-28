import Cache from '@blued-core/cache'

const defaultInterval = 1e3
const defaultMaxErrorCount = 10

export default class IntervalCache extends Cache {
  createCache<T extends any = any> (
    key: string,
    getData: Function,
    interval = defaultInterval,
    maxErrorCount = defaultMaxErrorCount
  ) {
    if (!this.has(key)) {
      // 如果没有已存在的key，则需要判断`getData`参数是否为函数类型，用来设置新的数据
      if (!getData || typeof getData !== 'function') throw new Error('getData must be function')

      // 获取缓存出错次数
      let cacheErrorCount = 0

      const intervalFunc = () => {
        try {
          this.set(key, getData())

          // 成功获取到数据后清空 errorCount
          cacheErrorCount = 0
        } catch (e) {
          console.error(`cache error with key: [${key}], count: [${cacheErrorCount}]`, e)
          cacheErrorCount += 1
        } finally {
          // 如果报错次数超出上限，则停止继续获取数据
          if (maxErrorCount <= cacheErrorCount) {
            console.error(`cache error with key: [${key}], auto close it.`)
          } else {
            setTimeout(intervalFunc, interval * (cacheErrorCount + 1))
          }
        }
      }
      intervalFunc()
    }

    return () => this.get(key) as T
  }
}
