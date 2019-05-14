import Cache from '@blued-core/cache'

const defaultInterval = 1e3
const infiniteErrorCount = -1

export interface Configs {
  interval?: number
  maxErrorCount?: number
}

export default class IntervalCache extends Cache {
  constructor (
    public interval: number = defaultInterval,
    public maxErrorCount: number = infiniteErrorCount
  ) {
    super()
  }

  createCache<T extends any = any> (
    key: string,
    getData: Function,
    configs: Configs = {
      interval: this.interval,
      maxErrorCount: this.maxErrorCount,
    }
  ) {
    const {
      interval = this.interval,
      maxErrorCount = this.maxErrorCount,
    } = configs
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
          // 如果设置了有效的报错次数，如果报错次数超出上限，则停止继续获取数据
          if (maxErrorCount > infiniteErrorCount && maxErrorCount <= cacheErrorCount) {
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

  createThenableCache<T extends any = any> (
    key: string,
    getData: Function,
    configs: Configs = {
      interval: this.interval,
      maxErrorCount: this.maxErrorCount,
    }
  ) {
    const {
      interval = this.interval,
      maxErrorCount = this.maxErrorCount,
    } = configs
    if (!this.has(key)) {
      // 如果没有已存在的key，则需要判断`getData`参数是否为函数类型，用来设置新的数据
      if (!getData || typeof getData !== 'function') throw new Error('getData must be function')

      // 获取缓存出错次数
      let cacheErrorCount = 0

      const intervalFunc = () => {
        const pro = getData()
        // 如果已经存在数据，并且是 thenable 的函数，则等待返回值
        if (this.has(key) && typeof pro.then === 'function') {
          pro.then((res: any) => this.set(key, res))
        } else {
          this.set(key, pro)
        }

        pro.then(() => {
          // 成功获取到数据后清空 errorCount
          cacheErrorCount = 0
        }, (e: Error) => {
          console.error(`cache error with key: [${key}], count: [${cacheErrorCount}]`, e)
          cacheErrorCount += 1
        }).then(() => {
          // 如果设置了有效的报错次数，如果报错次数超出上限，则停止继续获取数据
          if (maxErrorCount > infiniteErrorCount && maxErrorCount <= cacheErrorCount) {
            console.error(`cache error with key: [${key}], auto close it.`)
          } else {
            setTimeout(intervalFunc, interval * (cacheErrorCount + 1))
          }
        })
      }
      intervalFunc()
    }

    return () => this.get(key) as Promise<T>
  }
}
