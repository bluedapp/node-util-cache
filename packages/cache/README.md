一个提供给`client`使用的缓存组件。  
实现自[cache-intl](https://www.npmjs.com/package/@blued-core/cache-intl)。  

## install

```bash
npm i @blued-core/cache
```

## usage

```typescript
import Cache from '@blued-core/cache'

const cache = new Cache()

cache.set('text', 'Hello World')

console.log(cache.has('text'))
console.log(cache.get('text'))
```