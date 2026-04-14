# discuss

基于当前仓库结构，我对这轮讨论的结论更新如下。

## 1. 共享类型的归属

### 结论

我同意把共享工具类型抽到 `packages/types`。

### 原因

- `contracts` 应该只负责协议与契约。
- `MaybePromise`、`NestedPath` 这类类型不属于接口契约本身。
- 将它们统一收敛到 `@postsop/types`，比继续留在 `contracts` 或 `apis` 都更清晰。

### 当前做法

- `MaybePromise` 位于 [packages/types/src/index.ts](./packages/types/src/index.ts)
- `NestedPath` 位于 [packages/types/src/index.ts](./packages/types/src/index.ts)

## 2. `request.ts` 的输入输出类型策略

### 结论

我建议继续采用“输入保留语义，输出交给 endpoint 推导”的折中方案。

### 原因

- 请求参数类型写成 `SignInRequest`、`SignUpRequest`，在业务层更容易读。
- 响应类型由 `requestEndpoint(endpoint, ...)` 自动推导，可以减少重复声明。
- 如果输入输出都强行改成条件类型推导，调用层可读性会下降。

### 当前做法

- [apps/client-app/src/services/auth/request.ts](./apps/client-app/src/services/auth/request.ts)
- [apps/client-app/src/services/user/request.ts](./apps/client-app/src/services/user/request.ts)
- [packages/apis/src/create-api-client.ts](./packages/apis/src/create-api-client.ts)

## 3. 共享包注释的优先级

### 结论

共享包需要注释，但重点应放在公开边界。

### 推荐优先级

1. 工厂函数
2. 公开接口
3. 策略配置对象
4. 对外暴露的函数类型

### 当前做法

- 已为 [packages/apis/src/create-api-client.ts](./packages/apis/src/create-api-client.ts) 中的公开 API 补充核心注释

## 4. contracts 包的目录结构

### 结论

我同意按你提出的方向继续整理，并且建议做两点明确化：

1. 物理目录改成 `modules/ + core/`
2. `requests.ts / responses.ts` 改成更明确的 schema 文件名

### 推荐结构

```text
packages/contracts/src/
  modules/
    auth/
      endpoints.ts
      request-schemas.ts
      response-schemas.ts
      index.ts
    user/
      endpoints.ts
      response-schemas.ts
      index.ts
  core/
    endpoints.ts
    schema.ts
    http.ts
    permissions.ts
    index.ts
```

### 命名理由

- `request-schemas.ts`
  看到文件名就知道里面放的是 Zod request schema，而不是 request helper。
- `response-schemas.ts`
  同理，明确这是 schema 文件，不是 transport response 处理代码。
- `core/endpoints.ts`
  比单数 `endpoint.ts` 更符合“这里存放 endpoint 相关类型与工具”的语义。

## 5. contracts 的导出体系

### 结论

我同意你补充的导出建议，并且这是这次重构里最关键的一步。

### 推荐映射

- `./core -> ./core/index`
- `./http -> ./core/http`
- `./permissions -> ./core/permissions`
- `./* -> ./modules/*`

### 原因

- 物理目录可以更清晰地表达职责。
- 对外 import 路径仍然保持简洁：
  - `@postsop/contracts/auth`
  - `@postsop/contracts/user`
  - `@postsop/contracts/core`
  - `@postsop/contracts/http`
- 调整目录时，不会强迫业务层改成 `@postsop/contracts/modules/auth` 这种暴露内部结构的路径。

## 我的总体意见

你这次回复的方向是对的，而且比前一轮更完整：

- 类型层级更清晰了
- contracts 的职责边界更清晰了
- 对外导出和内部物理结构被分开考虑了

我补充的一点是：

“物理目录可以更细，但 public import 应尽量保持扁平。”

这能让仓库内部继续演进，而不会把内部结构泄漏给所有调用方。

## 后续还可以继续做的事

1. 给 `requestEndpoint` 增加 `params/query/body` 语义拆分
2. 为 `createApiClient` 的刷新队列补并发测试
3. 继续收敛 `contracts` 中 schema 与 endpoint 的命名规范
