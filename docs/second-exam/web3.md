# Web3 使用

本章只讲使用层面：钱包连接、链切换、合约读写、交易转账、签名登录，结合 wagmi + RainbowKit + ethers.js 的常见组合。

## 什么是 Web3？

::: details 参考答案

Web3 通常指“以区块链为基础设施”的应用形态：用户用钱包作为身份入口，在链上完成资产/状态的读写，应用的核心规则由智能合约约束。

常见关键词（使用层面理解即可）：

- 钱包：身份与签名工具（更像“账号 + U 盾”）
- 链：状态机与账本（交易写入区块后可被公开验证）
- 合约：业务规则与资产逻辑（读写合约等价于读写链上状态）

:::

## Web3 和 Web2 的区别是什么？

::: details 参考答案

可以按“身份、数据、资产、信任、成本”来记：

- 身份：Web2 账号（邮箱/手机号） vs Web3 钱包地址（签名证明你是你）
- 数据/状态：Web2 主要在中心化数据库 vs Web3 部分关键状态在链上（可验证、可追溯）
- 资产：Web2 资产由平台记账 vs Web3 资产由链记账（可转移、可组合）
- 信任：Web2 信任平台/后端 vs Web3 更多信任合约规则与链的共识
- 成本与体验：Web2 调用接口几乎无成本 vs Web3 写链上状态要付 gas，且有确认时间

:::

## 什么是 DApp？和普通 Web 应用有什么差别？

::: details 参考答案

DApp（去中心化应用）常见形态是“前端 + 合约 +（可选）后端”：

- 前端：展示 UI、发起签名/交易
- 合约：核心规则与资产逻辑（不可随意改）
- 后端（可选）：索引链上数据、做风控/反作弊、做聚合查询或缓存

差别（使用层面）：

- 有“签名/交易”的交互链路（用户会看到钱包弹窗）
- 有“链确认”的异步状态（pending/confirmed/reverted）
- 有“多链/多网络”的环境差异（主网、测试网、L2）

:::

## 钱包、私钥、助记词、地址分别是什么？什么能泄露，什么不能？

::: details 参考答案

使用层面记住三句话：

- 地址：公开的收款标识（可以给别人看）
- 私钥/助记词：控制资产与签名的最高权限（绝不能泄露）
- 钱包：帮你管理私钥并对外提供签名能力的工具

安全习惯（面试常问）：

- 不要在前端/日志里收集助记词、私钥
- 对“盲签名”保持警惕：签名前要给用户展示将要做什么（链、合约、方法、金额）
- 重要操作要二次确认（尤其是 approve、转账、跨链）

:::

## 交易、区块、Tx Hash、nonce、确认数分别是什么？

::: details 参考答案

常识速记：

- 交易（tx）：一次链上状态变更请求（转账/调用合约）
- Tx Hash：交易的唯一标识，可去区块浏览器查状态
- 区块：一批交易的打包结果
- nonce：同一地址发交易的序号，用来保证顺序与防重放
- 确认数：交易所在区块之后又追加了多少个区块，确认数越多越“稳”

UI 侧常见状态：

- 等用户签名/确认
- pending（已广播，等打包）
- confirmed（已确认）
- failed/reverted（执行失败或回滚）

:::

## 什么是 Gas？为什么有时交易会失败？

::: details 参考答案

Gas 可以理解为“链上执行的计算成本”：

- 读（view）一般不花 gas（本地模拟/节点计算）
- 写（交易）要花 gas（上链执行）

常见失败原因（使用层面排查顺序）：

- 用户拒绝签名/交易
- 链不对（发到错误网络）
- 余额不足（含 gas）
- 合约回滚（入参不对、权限不够、allowance 不够、滑点不满足等）
- RPC 超时/限流（需要重试或切备用 RPC）

:::

## wagmi + RainbowKit 项目怎么快速搭起来？

::: details 参考答案

核心是三件事：

- 配 wagmi config（链、传输、连接器）
- 应用根节点包 `WagmiProvider`、`RainbowKitProvider`
- 页面里用 hooks 拿账户状态与发起交互

示例（React）：

```tsx
import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const config = getDefaultConfig({
  appName: 'My Dapp',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [mainnet, sepolia],
})

const queryClient = new QueryClient()

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

要点：

- `projectId` 一般是 WalletConnect 的 Project ID（按团队环境变量管理）
- wagmi v2 依赖 React Query，实际项目里建议统一 QueryClient（别重复创建）

:::

## 怎么实现“连接钱包/断开连接/展示地址”？

::: details 参考答案

RainbowKit 直接给现成按钮，最省事：

```tsx
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function WalletEntry() {
  return <ConnectButton />
}
```

如果要自定义 UI，用 wagmi hooks：

```tsx
import { useAccount, useDisconnect } from 'wagmi'

export function WalletInfo() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  if (!isConnected) return null

  return (
    <div>
      <div>{address}</div>
      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  )
}
```

ethers.js（v6）版本（不依赖 wagmi，直接用浏览器注入的 `window.ethereum`）：

```ts
import { BrowserProvider } from 'ethers'

export async function connectWalletByEthers() {
  const ethereum = (window as any).ethereum
  if (!ethereum) throw new Error('No injected wallet found')

  await ethereum.request({ method: 'eth_requestAccounts' })
  const provider = new BrowserProvider(ethereum)
  const signer = await provider.getSigner()
  const address = await signer.getAddress()
  return { provider, signer, address }
}
```

展示地址（React 里最常见写法）：

```tsx
import { useEffect, useState } from 'react'
import { BrowserProvider } from 'ethers'

export function WalletInfoByEthers() {
  const [address, setAddress] = useState<string>()

  useEffect(() => {
    const ethereum = (window as any).ethereum
    if (!ethereum) return

    const provider = new BrowserProvider(ethereum)

    async function init() {
      const accounts: string[] = await ethereum.request({ method: 'eth_accounts' })
      if (!accounts[0]) return
      const signer = await provider.getSigner()
      setAddress(await signer.getAddress())
    }

    init()

    const onAccountsChanged = (acc: string[]) => setAddress(acc[0])
    ethereum.on?.('accountsChanged', onAccountsChanged)
    return () => ethereum.removeListener?.('accountsChanged', onAccountsChanged)
  }, [])

  if (!address) return null
  return <div>{address}</div>
}
```

常见细节：

- 地址展示通常做缩写（如 `0x12...89ab`）
- 连接态与业务登录态分开（连上钱包不等于登录完成）

:::

## 怎么判断用户当前链是否正确，并引导切链？

::: details 参考答案

拿到当前链 ID + 支持切链：

```tsx
import { sepolia } from 'wagmi/chains'
import { useChainId, useSwitchChain } from 'wagmi'

export function ChainGate() {
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const ok = chainId === sepolia.id

  if (ok) return null

  return <button onClick={() => switchChain({ chainId: sepolia.id })}>切到 Sepolia</button>
}
```

ethers.js（v6）版本（切链 / 加链）：

```ts
function toHexChainId(chainId: number) {
  return '0x' + chainId.toString(16)
}

export async function switchChainByEthers(chainId: number) {
  const ethereum = (window as any).ethereum
  if (!ethereum) throw new Error('No injected wallet found')
  await ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: toHexChainId(chainId) }],
  })
}

export async function addChainByEthers(params: {
  chainId: number
  chainName: string
  rpcUrls: string[]
  nativeCurrency: { name: string; symbol: string; decimals: number }
  blockExplorerUrls?: string[]
}) {
  const ethereum = (window as any).ethereum
  if (!ethereum) throw new Error('No injected wallet found')
  await ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [{ ...params, chainId: toHexChainId(params.chainId) }],
  })
}
```

常见坑：

- 用户钱包可能不支持目标链（或禁用了切链），要兜底提示手动切换
- 多链 dapp 不要把链写死在 UI，多用配置表驱动（链名、RPC、区块浏览器地址等）

:::

## 怎么读合约（read-only 调用）？

::: details 参考答案

用 `useReadContract` 最常见，适合读 `view/pure` 方法。

```tsx
import { useReadContract } from 'wagmi'

const erc20Abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
] as const

export function TokenBalance({ token, owner }: { token: `0x${string}`; owner: `0x${string}` }) {
  const { data, isLoading } = useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [owner],
    query: { enabled: Boolean(owner) },
  })

  if (isLoading) return <div>Loading...</div>
  return <div>{data?.toString()}</div>
}
```

使用要点：

- `enabled` 控制请求时机（避免 address 还没准备好就读）
- 读链上数据往往要加轮询或依赖区块更新策略（按业务频率取舍）

ethers.js（v6）版本：

```ts
import { BrowserProvider, Contract, formatUnits } from 'ethers'

const erc20Abi = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
] as const

export async function readErc20BalanceByEthers(params: { token: string; owner: string }) {
  const ethereum = (window as any).ethereum
  if (!ethereum) throw new Error('No injected wallet found')

  const provider = new BrowserProvider(ethereum)
  const contract = new Contract(params.token, erc20Abi, provider)

  const [raw, decimals] = await Promise.all([
    contract.balanceOf(params.owner) as Promise<bigint>,
    contract.decimals() as Promise<number>,
  ])

  return { raw, decimals, formatted: formatUnits(raw, decimals) }
}
```

:::

## 怎么写合约（approve/transfer/mint）并等待确认？

::: details 参考答案

写合约通常是两步：发交易拿 hash，然后等回执确认。

```tsx
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

const erc20Abi = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: 'ok', type: 'bool' }],
  },
] as const

export function TransferToken({ token, to, amount }: { token: `0x${string}`; to: `0x${string}`; amount: bigint }) {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash })

  return (
    <div>
      <button
        disabled={isPending || isLoading}
        onClick={() =>
          writeContract({
            address: token,
            abi: erc20Abi,
            functionName: 'transfer',
            args: [to, amount],
          })
        }
      >
        Transfer
      </button>

      {hash ? <div>{hash}</div> : null}
      {error ? <div>{error.message}</div> : null}
      {isSuccess ? <div>Confirmed</div> : null}
    </div>
  )
}
```

工程化要点：

- 交易 UI 状态要区分：钱包弹窗中、已发出（pending）、已确认（confirmed）、失败（reverted）
- 写交易前最好做前置校验：网络是否正确、地址合法、余额是否足够

ethers.js（v6）版本（发交易 + 等确认）：

```ts
import { BrowserProvider, Contract } from 'ethers'

const erc20Abi = ['function transfer(address to, uint256 amount) returns (bool)'] as const

export async function transferErc20ByEthers(params: { token: string; to: string; amount: bigint }) {
  const ethereum = (window as any).ethereum
  if (!ethereum) throw new Error('No injected wallet found')

  await ethereum.request({ method: 'eth_requestAccounts' })
  const provider = new BrowserProvider(ethereum)
  const signer = await provider.getSigner()

  const contract = new Contract(params.token, erc20Abi, signer)
  const tx = await contract.transfer(params.to, params.amount)
  const receipt = await tx.wait()
  return { hash: tx.hash as string, receipt }
}
```

:::

## 怎么做“原生转账”（转 ETH）？

::: details 参考答案

两种常见方式：

1）用 wagmi 的 `sendTransaction`

```tsx
import { parseEther } from 'viem'
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'

export function SendEth({ to, valueEth }: { to: `0x${string}`; valueEth: string }) {
  const { sendTransaction, data: hash, isPending, error } = useSendTransaction()
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash })

  return (
    <div>
      <button disabled={isPending || isLoading} onClick={() => sendTransaction({ to, value: parseEther(valueEth) })}>
        Send
      </button>
      {hash ? <div>{hash}</div> : null}
      {error ? <div>{error.message}</div> : null}
      {isSuccess ? <div>Confirmed</div> : null}
    </div>
  )
}
```

2）用 ethers.js（在 hooks 体系外，做一次性操作/脚本也常用）

```ts
import { BrowserProvider, parseEther } from 'ethers'

export async function sendEthByEthers(to: string, valueEth: string) {
  const provider = new BrowserProvider((window as any).ethereum)
  const signer = await provider.getSigner()
  const tx = await signer.sendTransaction({ to, value: parseEther(valueEth) })
  return await tx.wait()
}
```

:::

## 怎么做“合约交互 + 事件监听/刷新”？

::: details 参考答案

常见诉求是：写交易成功后刷新读数据，或监听合约事件更新 UI。

写交易成功后，最简单是等回执成功后触发 refetch：

```tsx
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

const counterAbi = [
  {
    name: 'count',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'inc',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
] as const

export function Counter({ address }: { address: `0x${string}` }) {
  const read = useReadContract({ address, abi: counterAbi, functionName: 'count' })
  const { writeContract, data: hash } = useWriteContract()
  const receipt = useWaitForTransactionReceipt({
    hash,
    query: { enabled: Boolean(hash) },
  })

  return (
    <div>
      <div>{read.data?.toString()}</div>
      <button onClick={() => writeContract({ address, abi: counterAbi, functionName: 'inc' })}>Inc</button>
      <button disabled={!receipt.isSuccess} onClick={() => read.refetch()}>
        Refresh
      </button>
    </div>
  )
}
```

事件监听场景（列表更新/通知）一般会配合“是否需要实时”的业务取舍：高频链上事件更建议用后端索引或订阅服务，前端只做展示与交互触发。

ethers.js（v6）版本（事件监听 + 清理）：

```ts
import { BrowserProvider, Contract } from 'ethers'

const erc20Abi = ['event Transfer(address indexed from, address indexed to, uint256 value)'] as const

export async function listenErc20TransferByEthers(params: {
  token: string
  onTransfer: (args: { from: string; to: string; value: bigint }) => void
}) {
  const ethereum = (window as any).ethereum
  if (!ethereum) throw new Error('No injected wallet found')

  const provider = new BrowserProvider(ethereum)
  const contract = new Contract(params.token, erc20Abi, provider)

  const handler = (from: string, to: string, value: bigint) => params.onTransfer({ from, to, value })
  contract.on('Transfer', handler)

  return () => {
    contract.off('Transfer', handler)
  }
}
```

:::

## 怎么处理常见错误（用户拒绝、gas 不足、链不对）？

::: details 参考答案

常见错误分层处理更稳：

- 用户拒绝签名/交易：提示“已取消”，不当成系统错误上报
- 链不匹配：提示切链，必要时给一键切链按钮
- gas/余额不足：提示余额不足或降低金额
- RPC/超时：提示重试，必要时切换备用 RPC

UI 侧建议统一把错误映射成可读文案（别直接把原始错误堆栈塞给用户）。

ethers.js / 注入钱包常见错误码（便于做文案映射）：

- `4001`：用户拒绝（取消签名/取消交易）
- `CALL_EXCEPTION`：合约回滚（revert），通常需要展示可读原因或引导检查入参
- `INSUFFICIENT_FUNDS`：余额不足（含 gas）

:::

## 怎么做“签名登录”（message 签名 + 后端验签）？

::: details 参考答案

前端的使用要点就两步：拿到后端给的 nonce/message，签名后回传给后端换 token。

```tsx
import { useAccount, useSignMessage } from 'wagmi'

export function SignIn() {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  async function onSignIn() {
    const res = await fetch('/api/auth/nonce?address=' + address)
    const { message } = await res.json()
    const signature = await signMessageAsync({ message })
    await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ address, message, signature }),
    })
  }

  return <button onClick={onSignIn}>Sign-In</button>
}
```

落地细节：

- message/nonce 必须由后端生成并校验有效期，前端只负责签名与回传
- 签名成功也要做“登录态持久化”（cookie/httpOnly 或 token 存储策略按团队规范）

ethers.js（v6）版本（signMessage）：

```ts
import { BrowserProvider } from 'ethers'

export async function signMessageByEthers(message: string) {
  const ethereum = (window as any).ethereum
  if (!ethereum) throw new Error('No injected wallet found')

  await ethereum.request({ method: 'eth_requestAccounts' })
  const provider = new BrowserProvider(ethereum)
  const signer = await provider.getSigner()
  const address = await signer.getAddress()
  const signature = await signer.signMessage(message)
  return { address, message, signature }
}
```

:::

## Token 金额怎么做“人类可读数值 ↔ 链上 amount”的转换？

::: details 参考答案

核心是 `decimals` 与大整数：

- 用户输入的 `1.23` 这类小数，链上要转成 `amount`（整数）
- 展示余额时，把链上 `amount` 再格式化成可读的字符串

ethers.js（v6）常用工具：

```ts
import { formatUnits, parseUnits } from 'ethers'

export function toAmount(input: string, decimals: number) {
  return parseUnits(input, decimals)
}

export function toDisplay(amount: bigint, decimals: number) {
  return formatUnits(amount, decimals)
}
```

落地注意：

- `decimals` 一般从合约读（如 ERC20 的 `decimals()`），不要写死
- 金额计算尽量用 `bigint`，避免 JS 浮点误差

:::

## ERC20 的 allowance/approve 流程怎么做？如何避免“无限授权”风险？

::: details 参考答案

典型流程是“先查 allowance，不够再 approve，再执行业务交易”。

```ts
import { BrowserProvider, Contract } from 'ethers'

const erc20Abi = [
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
] as const

export async function ensureAllowanceByEthers(params: { token: string; spender: string; required: bigint }) {
  const ethereum = (window as any).ethereum
  if (!ethereum) throw new Error('No injected wallet found')

  await ethereum.request({ method: 'eth_requestAccounts' })
  const provider = new BrowserProvider(ethereum)
  const signer = await provider.getSigner()
  const owner = await signer.getAddress()

  const token = new Contract(params.token, erc20Abi, signer)
  const current: bigint = await token.allowance(owner, params.spender)
  if (current >= params.required) return { approved: false, current }

  const tx = await token.approve(params.spender, params.required)
  await tx.wait()
  return { approved: true, current }
}
```

工程化要点（用法层面）：

- 默认用“精确授权”或“按需授权”，给用户可选“无限授权”
- 授权弹窗与业务交易弹窗要分开提示（用户体验）
- 有些 token 存在“先把 allowance 置 0 再 approve”的兼容问题，需要按项目经验做兜底策略

:::

## 怎么估算 gas，并设置 EIP-1559 手续费参数？

::: details 参考答案

常见做法：先 `estimateGas`，再从 `getFeeData()` 拿到建议费率，最后发交易。

```ts
import { BrowserProvider, parseEther } from 'ethers'

export async function sendEthWithFeeByEthers(params: { to: string; valueEth: string }) {
  const ethereum = (window as any).ethereum
  if (!ethereum) throw new Error('No injected wallet found')

  await ethereum.request({ method: 'eth_requestAccounts' })
  const provider = new BrowserProvider(ethereum)
  const signer = await provider.getSigner()

  const value = parseEther(params.valueEth)
  const fee = await provider.getFeeData()
  const gas = await signer.estimateGas({ to: params.to, value })

  const tx = await signer.sendTransaction({
    to: params.to,
    value,
    gasLimit: gas,
    maxFeePerGas: fee.maxFeePerGas ?? undefined,
    maxPriorityFeePerGas: fee.maxPriorityFeePerGas ?? undefined,
  })

  return await tx.wait()
}
```

落地要点：

- 估算 gas 失败时，往往是“会 revert”，需要提示用户检查入参/余额/权限
- fee 参数要允许用户“加速”（提高 maxFeePerGas / maxPriorityFeePerGas）

:::

## 交易 pending 很久怎么做“加速/取消/替换”？

::: details 参考答案

思路是“用同一个 nonce 发一笔更高费率的交易来替换”：

```ts
import { BrowserProvider, parseEther } from 'ethers'

export async function speedUpTxByEthers(params: {
  to: string
  valueEth: string
  nonce: number
  maxFeePerGas: bigint
  maxPriorityFeePerGas: bigint
}) {
  const ethereum = (window as any).ethereum
  if (!ethereum) throw new Error('No injected wallet found')

  await ethereum.request({ method: 'eth_requestAccounts' })
  const provider = new BrowserProvider(ethereum)
  const signer = await provider.getSigner()

  const tx = await signer.sendTransaction({
    to: params.to,
    value: parseEther(params.valueEth),
    nonce: params.nonce,
    maxFeePerGas: params.maxFeePerGas,
    maxPriorityFeePerGas: params.maxPriorityFeePerGas,
  })

  return await tx.wait()
}
```

取消交易常见做法：同 nonce 发一笔“转 0 给自己”的交易（本质也是替换）。

:::

## 交易什么时候算“成功”？确认数怎么处理？

::: details 参考答案

面试表达用“回执 + 确认数”更稳：

- `receipt.status === 1` 表示该交易在某个区块里执行成功
- 业务上常用 N 次确认（如 1/3/12），降低重组带来的状态回滚风险

ethers.js（v6）等待 N 次确认：

```ts
import { BrowserProvider } from 'ethers'

export async function waitForConfirmations(hash: string, confirmations = 1) {
  const ethereum = (window as any).ethereum
  if (!ethereum) throw new Error('No injected wallet found')

  const provider = new BrowserProvider(ethereum)
  return await provider.waitForTransaction(hash, confirmations)
}
```

:::

## 前端怎么生成区块浏览器链接（tx/address），方便用户自查？

::: details 参考答案

做一份 chainId 到浏览器 baseUrl 的映射即可：

```ts
const explorerByChainId: Record<number, string> = {
  1: 'https://etherscan.io',
  11155111: 'https://sepolia.etherscan.io',
}

export function txUrl(chainId: number, hash: string) {
  return `${explorerByChainId[chainId]}/tx/${hash}`
}

export function addressUrl(chainId: number, address: string) {
  return `${explorerByChainId[chainId]}/address/${address}`
}
```

:::

## 只读场景（不连钱包）怎么访问链上数据？RPC 怎么做容灾？

::: details 参考答案

前端/服务端都常用“只读 JsonRpcProvider”，不依赖用户钱包：

```ts
import { Contract, JsonRpcProvider } from 'ethers'

const rpc = new JsonRpcProvider('https://rpc.ankr.com/eth')
const erc20Abi = ['function totalSupply() view returns (uint256)'] as const

export async function readTotalSupply(params: { token: string }) {
  const token = new Contract(params.token, erc20Abi, rpc)
  return (await token.totalSupply()) as bigint
}
```

落地要点：

- RPC 可能限流/抖动，前端需要超时与重试策略，并准备备用 RPC 做降级
- 公开 RPC 的稳定性不可控，生产环境通常用可观测/可 SLA 的供应商（API key 按环境变量管理）

:::

## 怎么做 Typed Data（EIP-712）签名，用在 permit 或更安全的登录？

::: details 参考答案

ethers.js（v6）里用 `signTypedData`：

```ts
import { BrowserProvider } from 'ethers'

export async function signTypedDataByEthers(params: {
  domain: Record<string, unknown>
  types: Record<string, Array<{ name: string; type: string }>>
  value: Record<string, unknown>
}) {
  const ethereum = (window as any).ethereum
  if (!ethereum) throw new Error('No injected wallet found')

  await ethereum.request({ method: 'eth_requestAccounts' })
  const provider = new BrowserProvider(ethereum)
  const signer = await provider.getSigner()

  const signature = await signer.signTypedData(params.domain, params.types, params.value)
  return signature
}
```

常用场景：

- Permit：减少一次 approve 交易（体验更好）
- 登录：把 message 结构化，减少“盲签名”风险

:::

## 怎么按区块范围读取 logs，并解析成事件数据？

::: details 参考答案

常见用法：用 `getLogs` 拉取指定区块范围的事件，再用 `Interface` 解析。

```ts
import { Interface, JsonRpcProvider } from 'ethers'

const rpc = new JsonRpcProvider('https://rpc.ankr.com/eth')
const iface = new Interface(['event Transfer(address indexed from, address indexed to, uint256 value)'])

export async function getErc20Transfers(params: { token: string; fromBlock: number; toBlock: number }) {
  const logs = await rpc.getLogs({
    address: params.token,
    fromBlock: params.fromBlock,
    toBlock: params.toBlock,
    topics: [iface.getEvent('Transfer').topicHash],
  })

  return logs.map((log) => {
    const parsed = iface.parseLog(log)
    return {
      txHash: log.transactionHash,
      from: parsed.args.from as string,
      to: parsed.args.to as string,
      value: parsed.args.value as bigint,
    }
  })
}
```

落地要点：

- 区块范围过大会被 RPC 限流，需要分段分页拉取
- 事件展示要考虑重组与重复（以 txHash+logIndex 做去重更稳）

:::
