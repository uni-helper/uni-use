import type { Mock } from 'vitest'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useDownloadFile } from '../src/useDownloadFile'

/** h5 的 uni 桩没有 downloadFile，按需补上 */
function stubDownloadFile(delay = 10) {
  const task = {
    abort: vi.fn(),
    onProgressUpdate: vi.fn(),
  }
  let count = 0
  const downloadFile = vi.fn((options: any) => {
    count += 1
    const current = count
    setTimeout(() => {
      options.success?.({
        tempFilePath: `/tmp/${current}.png`,
        statusCode: 200,
        errMsg: 'downloadFile:ok',
      })
      options.complete?.({ errMsg: 'downloadFile:ok' })
    }, delay)
    return task
  })
  Object.assign(uni, { downloadFile })
  return { downloadFile, task }
}

describe('useDownloadFile', () => {
  afterEach(() => {
    delete (uni as unknown as Record<string, Mock | undefined>).downloadFile
  })

  it('拿到临时文件路径', async () => {
    stubDownloadFile()

    const result = await useDownloadFile('/a.png')

    expect(result.data.value).toEqual({ tempFilePath: '/tmp/1.png' })
    expect(result.isFinished.value).toBe(true)
  })

  it('重复 execute 会等新的请求结束，不返回上一次的结果', async () => {
    stubDownloadFile()

    const download = useDownloadFile('/a.png')
    await download

    await download.execute()

    expect(download.data.value).toEqual({ tempFilePath: '/tmp/2.png' })
  })

  it('abort 会调用 task 的 abort', async () => {
    const { task } = stubDownloadFile(50)

    const download = useDownloadFile('/a.png')
    download.abort()

    expect(task.abort).toHaveBeenCalled()
    expect(download.isAborted.value).toBe(true)
  })
})
