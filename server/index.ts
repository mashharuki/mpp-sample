import { Hono } from 'hono'
import { Mppx, tempo } from 'mppx/hono'
import { privateKeyToAccount } from 'viem/accounts'


// USDC.e (Bridged USDC via Stargate) on Tempo (chain ID 4217)
const USDC_E = '0x20c000000000000000000000b9537d11c60e8b50'

const recipient = process.env.RECIPIENT_ADDRESS ?? '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

const mppx = Mppx.create({
  methods: [
    tempo({
      testnet: true,
      currency: USDC_E,
      recipient: recipient as `0x${string}`,
      account: privateKeyToAccount(process.env.MPP_SECRET_KEY as `0x${string}`),
    }),
  ],
})

const app = new Hono()

app.get('/api/test', mppx.charge({ amount: '0.01' }), (c) =>
  c.json({ message: 'Hello from the paid API!' }),
)

const server = Bun.serve({
  port: 3000,
  fetch: app.fetch,
})

console.log(`Server listening on http://localhost:${server.port}`)
