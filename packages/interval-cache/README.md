# interval-cache

用于实现一些定时更新的缓存。  

## install

```bash
npm install @blued-core/interval-cache
```

## usage

```typescript
import IntervalCache from '@blued-core/interval-cache'

const intervalCache = new IntervalCache()

const func = intervalCache.createCache('testa', () => 'Hello World')

func() // => Hello World
func() // => Hello World

// use async cache

async function test () {
  const proFunc = intervalCache.createThenableCache('testb', async () => Promise.resolve('ping'))

  proFunc().then(console.log)   // => ping

  console.log(await proFunc())  // => ping
}
```

## config

> 实例化时传入的两个参数

```typescript
import IntervalCache from '@blued-core/interval-cache'

const interval = 2000
const maxErrorCount = 10

const intervalCache = new IntervalCache(interval, maxErrorCount)
```

param|type|required|default|desc
:--|:--|:--|:--|:--
interval|`number`|❌|1000ms|更新缓存的间隔（不包含代码执行的时间）
maxErrorCount|`number`|❌|`-1`|连续报错终止的次数，默认为`-1`表示无限制，每次出错会按照`interval`进行叠加时长，例如，出错三次，`interval`为`100ms`，则第二次执行的时间为`200ms`后，第三次为`300ms`后。 _在正确获取到结果后会清除报错次数，重新计数_

以上两个参数可以通过在调用`createCache`、`createThenableCache`时传入第三个参数进行覆盖：

> 如不填写则使用全局配置

```typescript
intervalCache.createCache('key', () => 'get data', {
  interval: 3000,
  maxErrorCount: 50
})
```