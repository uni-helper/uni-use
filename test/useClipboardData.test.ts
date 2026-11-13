import type { Mock } from 'vitest'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useClipboardData } from '../src/useClipboardData'

/** h5 的 uni 桩没有剪切板方法，按需补上 */
function stubClipboard(value: string) {
  const getClipboardData = vi.fn((options: any) => {
    options.success?.({ data: value })
  })
  const setClipboardData = vi.fn((options: any) => {
    options.success?.({ data: options.data })
  })
  Object.assign(uni, { getClipboardData, setClipboardData })
  return { getClipboardData, setClipboardData }
}

/** 让 read() 里的 await 走完 */
const tick = () => new Promise(resolve => setTimeout(resolve, 0))

describe('useClipboardData', () => {
  afterEach(() => {
    delete (uni as unknown as Record<string, Mock | undefined>).getClipboardData
    delete (uni as unknown as Record<string, Mock | undefined>).setClipboardData
  })

  it('挂载时只读取，不把读到的内容写回去', async () => {
    const { getClipboardData, setClipboardData } = stubClipboard('from-clipboard')

    // 关掉监听，避免 useInterceptor 的全局包装影响断言
    const data = useClipboardData('', { listenToClipboardDataChanges: false })
    await tick()
    await nextTick()

    expect(getClipboardData).toHaveBeenCalledOnce()
    expect(data.value).toBe('from-clipboard')
    expect(setClipboardData).not.toHaveBeenCalled()
  })

  it('主动赋值才写回，并把 showToast 传下去', async () => {
    const { setClipboardData } = stubClipboard('old')

    const data = useClipboardData('', {
      listenToClipboardDataChanges: false,
      showToast: false,
    })
    await tick()

    data.value = 'new'
    await nextTick()

    expect(setClipboardData).toHaveBeenCalledWith(expect.objectContaining({
      data: 'new',
      showToast: false,
    }))
  })
})
