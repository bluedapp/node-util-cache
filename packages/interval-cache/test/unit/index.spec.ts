/* eslint-disable import/no-extraneous-dependencies */
import { expect } from 'chai'
import IntervalCache from '../../src/index'

describe('normal', () => {
  it(`function return string`, done => {
    const intervalCache = new IntervalCache()

    const func = intervalCache.createCache('testa', () => 'Hello World')

    // async function test () {
    //   const proFunc = intervalCache.createThenableCache('testb', async () => Promise.resolve('ping'))

    //   proFunc().then(console.log) // => ping

    //   console.log(await proFunc()) // => ping
    // }

    expect(func()).to.be.a('string')
    expect(func()).to.equal('Hello World')
    done()
  })

  it(`async function return string`, async () => {
    const intervalCache = new IntervalCache()

    const proFunc = intervalCache.createThenableCache('testb', async () => Promise.resolve('ping'))

    expect(await proFunc()).to.be.a('string')
    expect(await proFunc()).to.equal('ping')
  })
})
