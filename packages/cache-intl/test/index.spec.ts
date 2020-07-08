/* eslint-disable import/no-extraneous-dependencies */
import { expect } from 'chai'
import Cache from '../src/index'

describe('normal', () => {
  it(`return result`, done => {
    class NewCache<T extends any = any> implements Cache<T> {
      private cache = new Map<string, T>()

      set(key: string, value: T) { this.cache.set(key, value) }

      get(key: string) { return this.cache.get(key) }

      has(key: string) { return this.cache.has(key) }
    }

    const cache = new NewCache()

    cache.set('a', 123)
    expect(cache.get('a')).to.equal(123)
    done()
  })
})
