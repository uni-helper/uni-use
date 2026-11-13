import type { Mock } from 'vitest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRouter } from '../src/useRouter'
import { useSetup } from './index'

/** h5 的 uni 桩没有路由方法，按需补上并记录调用 */
function stubRouter() {
  const switchTab = vi.fn((options: any) => {
    options.success?.({ errMsg: 'switchTab:ok' })
    options.complete?.({ errMsg: 'switchTab:ok' })
  })
  const navigateTo = vi.fn((options: any) => {
    options.success?.({ errMsg: 'navigateTo:ok' })
    options.complete?.({ errMsg: 'navigateTo:ok' })
  })
  Object.assign(uni, {
    switchTab,
    navigateTo,
    addInterceptor: vi.fn(),
  })
  return { switchTab, navigateTo }
}

describe('useRouter', () => {
  beforeEach(() => {
    ;(globalThis as unknown as { getCurrentPages: () => unknown[] }).getCurrentPages = () => []
  })

  afterEach(() => {
    delete (globalThis as unknown as { getCurrentPages?: () => unknown[] }).getCurrentPages
    for (const name of ['switchTab', 'navigateTo', 'addInterceptor']) {
      delete (uni as unknown as Record<string, Mock | undefined>)[name]
    }
  })

  it('pages.json 风格的 tabBar 路径（没有前导斜杠）也会走 switchTab', () => {
    const { switchTab, navigateTo } = stubRouter()

    const router = useSetup(() =>
      useRouter({
        tabBarList: [
          { pagePath: 'pages/index/index' },
        ],
      }),
    )

    router.navigate({ url: '/pages/index/index' })

    expect(switchTab).toHaveBeenCalledOnce()
    expect(navigateTo).not.toHaveBeenCalled()
  })

  it('带前导斜杠的 tabBar 路径同样命中', () => {
    const { switchTab, navigateTo } = stubRouter()

    const router = useSetup(() =>
      useRouter({
        tabBarList: ['/pages/mine/index'],
      }),
    )

    router.redirect({ url: '/pages/mine/index' })

    expect(switchTab).toHaveBeenCalledOnce()
    expect(navigateTo).not.toHaveBeenCalled()
  })

  it('普通页面仍然走 navigateTo', () => {
    const { switchTab, navigateTo } = stubRouter()

    const router = useSetup(() =>
      useRouter({
        tabBarList: [
          { pagePath: 'pages/index/index' },
        ],
      }),
    )

    router.navigate({ url: '/pages/detail/index' })

    expect(navigateTo).toHaveBeenCalledOnce()
    expect(switchTab).not.toHaveBeenCalled()
  })
})
