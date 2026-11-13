import type { Mock } from 'vitest'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { usePageScroll } from '../src/usePageScroll'

/** h5 的 uni 对象里没有 pageScrollTo，按需补一个可断言的实现 */
function stubPageScrollTo() {
  const pageScrollTo = vi.fn()
  ;(uni as unknown as { pageScrollTo: Mock }).pageScrollTo = pageScrollTo
  return pageScrollTo
}

describe('usePageScroll', () => {
  afterEach(() => {
    delete (uni as unknown as { pageScrollTo?: Mock }).pageScrollTo
  })

  it('选择器变化时滚动到目标位置', async () => {
    const pageScrollTo = stubPageScrollTo()
    const { scrollToSelector } = usePageScroll({
      onPageScroll: () => {},
    })

    scrollToSelector.value = '#target'
    await nextTick()

    expect(pageScrollTo).toHaveBeenCalledWith({
      selector: '#target',
      duration: 300,
    })
  })

  it('清空选择器时不滚动', async () => {
    const pageScrollTo = stubPageScrollTo()
    const { scrollToSelector } = usePageScroll({
      onPageScroll: () => {},
      scrollToSelector: '#target',
    })

    scrollToSelector.value = ''
    await nextTick()

    expect(pageScrollTo).not.toHaveBeenCalled()
  })
})
