import type { Mock } from 'vitest'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useUploadFile } from '../src/useUploadFile'

/** h5 的 uni 桩没有 uploadFile，按需补上 */
function stubUploadFile(delay = 10) {
  const task = {
    abort: vi.fn(),
    onProgressUpdate: vi.fn(),
  }
  let count = 0
  const uploadFile = vi.fn((options: any) => {
    count += 1
    const current = count
    setTimeout(() => {
      options.success?.({
        data: JSON.stringify({ id: current }),
        statusCode: 200,
        errMsg: 'uploadFile:ok',
      })
      options.complete?.({ errMsg: 'uploadFile:ok' })
    }, delay)
    return task
  })
  Object.assign(uni, { uploadFile })
  return { uploadFile, task }
}

describe('useUploadFile', () => {
  afterEach(() => {
    delete (uni as unknown as Record<string, Mock | undefined>).uploadFile
  })

  it('拿到上传响应里的 data', async () => {
    stubUploadFile()

    const result = await useUploadFile('/upload')

    expect(result.data.value).toBe(JSON.stringify({ id: 1 }))
    expect(result.isFinished.value).toBe(true)
  })

  it('重复 execute 会等新的请求结束，不返回上一次的结果', async () => {
    stubUploadFile()

    const upload = useUploadFile('/upload')
    await upload

    await upload.execute()

    expect(upload.data.value).toBe(JSON.stringify({ id: 2 }))
  })

  it('请求失败时把错误放进 error 并 reject', async () => {
    const task = {
      abort: vi.fn(),
    }
    const uploadFile = vi.fn((options: any) => {
      setTimeout(() => {
        options.fail?.({ errMsg: 'uploadFile:fail' })
        options.complete?.({ errMsg: 'uploadFile:fail' })
      }, 10)
      return task
    })
    Object.assign(uni, { uploadFile })

    const upload = useUploadFile('/upload')

    await expect(upload).rejects.toEqual({ errMsg: 'uploadFile:fail' })
    expect(upload.error.value).toEqual({ errMsg: 'uploadFile:fail' })
  })
})
