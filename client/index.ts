import { Mppx, tempo } from 'mppx/client'
import { privateKeyToAccount } from 'viem/accounts'

// 秘密鍵
const privateKey = process.env.TEMPO_PRIVATE_KEY as `0x${string}`;

if (!privateKey) {
	throw new Error('Missing TEMPO_PRIVATE_KEY. Set a Tempo private key before running this client.')
}

if (!/^0x[a-fA-F0-9]{64}$/.test(privateKey)) {
	throw new Error('TEMPO_PRIVATE_KEY must be a 32-byte hex string prefixed with 0x.')
}

// Mppxクライアントの作成
Mppx.create({
	methods: [tempo({ account: privateKeyToAccount(privateKey) })],
})

// サーバーにペイドピンを送信
// const response = await fetch('https://mpp.dev/api/ping/paid')
const response = await fetch('http://localhost:3000/api/test')
const body = await response.text()

console.log(`Paid ping status: ${response.status}`)
console.log(body)