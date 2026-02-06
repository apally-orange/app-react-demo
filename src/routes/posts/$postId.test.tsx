/** biome-ignore-all lint/security/noSecrets: no secret in test */
import { describe, expect, it, vi } from 'vitest'
import { postQueryOptions, Route } from './$postId.tsx'

describe.each([{ id: 12 }, { id: 1 }, { id: 42 }])('postQueryOptions', () => {
	it('should return correct query options for a given postId', ({ id }) => {
		const postId = id
		const result = postQueryOptions(postId)

		expect(result.queryKey).toEqual(['posts', postId])
		expect(typeof result.queryFn).toBe('function')
	})
})

describe('postQueryOptions', () => {
	it('should fetch post data and return the response', async () => {
		const postId = '99'
		const mockedData = { id: 99, title: 'Mock post' }

		globalThis.fetch = vi.fn().mockResolvedValueOnce({
			json: vi.fn().mockResolvedValueOnce(mockedData),
		}) as unknown as typeof fetch

		const { queryFn } = postQueryOptions(postId)
		const data = await queryFn()

		expect(fetch).toHaveBeenCalledWith(`https://dummyjson.com/posts/${postId}`)
		expect(data).toEqual(mockedData)
	})
})

describe('Route loader', () => {
	it('calls ensureQueryData with correct postId', async () => {
		const postId = '123'
		const ensureQueryData = vi.fn().mockResolvedValue('someData')
		const context = { queryClient: { ensureQueryData } }
		const params = { postId }

		// @ts-expect-error: typing workaround for direct call
		await Route.options.loader({ context, params })

		expect(ensureQueryData).toHaveBeenCalled()
		const callArgs = ensureQueryData.mock.calls[0][0].queryKey
		expect(callArgs).toEqual(['posts', postId])
	})
})
