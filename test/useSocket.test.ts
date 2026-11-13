import type { Mock } from 'vitest'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useSocket } from '../src/useSocket'
import { useSetup } from './index'

interface FakeSocket {
  handlers: Record<'open' | 'close' | 'error' | 'message', Array<(payload: any) => void>>
  task: {
    close: Mock
    onClose: (fn: (payload: any) => void) => void
    onError: (fn: (payload: any) => void) => void
    onMessage: (fn: (payload: any) => void) => void
    onOpen: (fn: (payload: any) => void) => void
    send: Mock
  }
}

function createFakeSocket(): FakeSocket {
  const handlers = {
    open: [] as Array<(payload: any) => void>,
    close: [] as Array<(payload: any) => void>,
    error: [] as Array<(payload: any) => void>,
    message: [] as Array<(payload: any) => void>,
  }
  const task = {
    send: vi.fn(),
    close: vi.fn(),
    onOpen: (fn: (payload: any) => void) => handlers.open.push(fn),
    onClose: (fn: (payload: any) => void) => handlers.close.push(fn),
    onError: (fn: (payload: any) => void) => handlers.error.push(fn),
    onMessage: (fn: (payload: any) => void) => handlers.message.push(fn),
  }
  return { handlers, task }
}

function stubConnectSocket() {
  const sockets: FakeSocket[] = []
  const connectSocket = vi.fn(() => {
    const socket = createFakeSocket()
    sockets.push(socket)
    return socket.task
  })
  Object.assign(uni, { connectSocket })
  return { sockets, connectSocket }
}

describe('useSocket', () => {
  afterEach(() => {
    delete (uni as unknown as Record<string, Mock | undefined>).connectSocket
  })

  it('切换 url 后旧连接的 onClose 不会改状态，也不会多开一条', async () => {
    const { sockets } = stubConnectSocket()

    const url = ref('wss://a.example.com')
    const socket = useSetup(() => useSocket(url))

    expect(sockets).toHaveLength(1)

    url.value = 'wss://b.example.com'
    await nextTick()

    expect(sockets).toHaveLength(2)
    sockets[1].handlers.open.forEach(fn => fn({}))
    expect(socket.status).toBe('OPEN')

    // 旧连接此时才关闭
    sockets[0].handlers.close.forEach(fn => fn({ code: 1000, reason: '' }))

    expect(sockets).toHaveLength(2)
    expect(socket.status).toBe('OPEN')
    expect(socket.task).toBe(sockets[1].task)
  })

  it('断线期间最多缓存 100 条消息', async () => {
    const { sockets } = stubConnectSocket()

    const socket = useSetup(() => useSocket('wss://a.example.com'))

    for (let i = 0; i < 150; i++) {
      socket.send(`message-${i}`)
    }

    sockets[0].handlers.open.forEach(fn => fn({}))

    const sent = sockets[0].task.send.mock.calls.map(([payload]) => payload.data)
    expect(sent).toHaveLength(100)
    expect(sent[0]).toBe('message-50')
    expect(sent.at(-1)).toBe('message-149')
  })
})
