import { Mppx, tempo } from 'mppx/server'
import { privateKeyToAccount } from 'viem/accounts'


// USDC.e (Bridged USDC via Stargate) on Tempo (chain ID 4217)
const USDC_E = '0x20c000000000000000000000b9537d11c60e8b50'

const recipient = process.env.RECIPIENT_ADDRESS ?? '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

const mppx = Mppx.create({
  methods: [
    tempo({
      currency: USDC_E,
      recipient: recipient as `0x${string}`,
      account: privateKeyToAccount(process.env.MPP_SECRET_KEY as `0x${string}`),
    }),
  ],
})

const server = Bun.serve({
  port: 3000,
  async fetch(request: Request) {
    const url = new URL(request.url)

    if (url.pathname === '/api/test') {
      const response = await mppx.charge({ amount: '0.01' })(request)

      // Payment required — return 402 Challenge
      if (response.status === 402) return response.challenge

      // Payment verified — return resource with Receipt header
      return response.withReceipt(Response.json({ message: 'Hello from the paid API!' }))
    }

    return new Response('Not Found', { status: 404 })
  },
})

console.log(`Server listening on http://localhost:${server.port}`)
