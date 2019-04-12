/* eslint-disable import/no-extraneous-dependencies */
import { expect } from 'chai'
import Cache from '../src/index'

describe('normal', () => {
  it(`get cache value`, done => {
    const cache = new Cache()

    cache.set('a', 123)
    expect(cache.get('a')).to.equal(123)
    done()
  })
})
