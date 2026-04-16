一、不要再按“controllers / services / prisma”分目录

中大型项目更合适的方式是：按业务域拆模块，每个模块内部再分层。

更推荐这种：

src/
modules/
user/
user.module.ts
presentation/
user.controller.ts
dto/
application/
commands/
create-user.use-case.ts
update-user-profile.use-case.ts
queries/
get-user-detail.query.ts
list-users.query.ts
domain/
entities/
services/
repositories/
user.repository.ts
infrastructure/
persistence/
user-prisma.repository.ts
user.select.ts
user.mapper.ts
order/
billing/
shared/
prisma/
prisma.module.ts
prisma.service.ts
prisma.extensions.ts
prisma-transaction.service.ts
common/
exceptions/
guards/
interceptors/
types/

核心思想：

presentation：HTTP 适配层，只负责入参、鉴权、响应格式。
application：用例层，组织业务流程。
domain：纯业务规则，不依赖 Nest / Prisma。
infrastructure：Prisma、外部 API、缓存、消息队列等实现细节。

这样做的效果是：
Controller 变薄，Service 不再是垃圾场，Prisma 细节不会污染业务层。

二、Service 不要再是“大而全”，而要拆成两类
1）Application Service / Use Case

一个用例一个类，职责非常明确：

CreateUserUseCase
ResetPasswordUseCase
ConfirmOrderUseCase

它负责：

校验业务前置条件
调用 repository
控制事务
触发领域事件 / 集成事件
2）Query Service

专门处理读接口：

列表页
详情页
管理后台聚合查询
导出接口
dashboard

这样你就不会把“写业务”和“复杂 select / include / 聚合查询”都塞进一个 UserService。

如果某个模块读多写少，或者读模型和写模型差异很大，可以进一步引入 Nest 的 CQRS。Nest 官方提供了 CommandBus / QueryBus，把命令处理器和查询处理器拆开；但这更适合复杂模块，没必要全局一上来就铺满。

三、Prisma 里大量 select 怎么组织

这是你问题里最关键的一点。结论很明确：

不要这样写
// 坏例子：select 到处散落
async getUserDetail(id: string) {
return this.prisma.user.findUnique({
where: { id },
select: {
id: true,
name: true,
email: true,
profile: {
select: {
avatar: true,
bio: true,
},
},
},
});
}

这种写法的后果：

重复
不可复用
字段变更时全局难追踪
类型漂移
容易 over-fetch / under-fetch

Prisma 官方支持 select / include 精确控制返回字段，也支持 omit 排除字段；从 Prisma ORM 6.2.0 起，omit 已经是正式支持，不必再靠预览特性。

四、推荐的 select 管理模式
模式 A：每个模型一个 \*.select.ts

最实用。

// user.select.ts
import { Prisma } from '@prisma/client';

export const userBaseSelect = {
id: true,
name: true,
avatar: true,
} satisfies Prisma.UserSelect;

export const userListSelect = {
id: true,
name: true,
avatar: true,
createdAt: true,
status: true,
} satisfies Prisma.UserSelect;

export const userDetailSelect = {
id: true,
name: true,
email: true,
avatar: true,
profile: {
select: {
bio: true,
company: true,
},
},
} satisfies Prisma.UserSelect;

export type UserBaseDto = Prisma.UserGetPayload<{
select: typeof userBaseSelect;
}>;

export type UserListDto = Prisma.UserGetPayload<{
select: typeof userListSelect;
}>;

export type UserDetailDto = Prisma.UserGetPayload<{
select: typeof userDetailSelect;
}>;

然后在 query service / repository 里复用：

return this.prisma.user.findUnique({
where: { id },
select: userDetailSelect,
});

这套方式的好处：

字段选择统一收口
返回类型自动推导
改字段时只改一处
一眼就能看出每种接口的读模型

Prisma 文档也明确支持把 select 作为类型安全对象复用；同时需要注意，Prisma.validator 在新一代 prisma-client 生成器下并不推荐，官方说明它只适用于旧的 prisma-client-js，新项目通常优先用 TypeScript 原生 satisfies。

模式 B：按“场景”而不是按“模型”组织 select

比如：

auth.select.ts
admin-user.select.ts
public-profile.select.ts

适合一个模型在不同上下文中暴露完全不同字段的场景。
例如 User 在：

公开资料
后台管理
登录态用户自己
审计报表

这 4 个视角下返回字段完全不同。

模式 C：全局 omit 处理敏感字段

非常推荐。

const prisma = new PrismaClient({
omit: {
user: {
password: true,
salt: true,
},
},
});

这样可以从底层兜住敏感字段，避免某个同事某天写了个 findUnique() 把密码哈希直接带出来。Prisma 官方说明 omit 可以做全局和单次查询级别的字段排除。

模式 D：复杂查询单独做 QueryService

例如：

用户详情页需要 8 张表聚合
后台列表要筛选、排序、分页、统计
仪表盘要混合聚合与缓存

这类查询不要放到 domain service，也不要硬塞进 repository 的“通用 CRUD”里。
直接做：

application/queries/get-user-dashboard.query.ts
application/queries/list-orders.query.ts

它们的依赖通常是：

PrismaService
CacheService
少量 mapper

而不是领域实体。

五、Repository 该不该有

建议有，但不要做成“万能 BaseRepository + 万能 BaseService”。

更合适的做法是：

Repository 负责
针对聚合根的持久化
findById
save
exists
与业务语义一致的数据访问
QueryService 负责
复杂读模型
分页/排序/筛选
管理后台列表
联表聚合
返回面向接口的 DTO

也就是说：

写模型 走 repository
读模型 走 query service

这其实就是“轻量 CQRS”，很适合 NestJS + Prisma。

六、Prisma Client Extensions 很适合企业项目

Prisma 官方提供了 client / model / query / result 四类扩展；扩展后的 client 是隔离实例，但共享同一个连接池。它很适合把一些横切逻辑从业务代码里拿出去。

典型用法：

1）多租户过滤

给所有查询自动注入 tenantId

2）软删除

默认加 deletedAt: null

3）审计日志

统一记录 model / action / requestId

4）默认分页上限

限制 findMany 的 take

Prisma 官方文档也说明，query extension 可以修改查询生命周期中的 args，并且可作用于特定 model、特定 operation，或全模型；但不能随便改 select/include，因为那会破坏返回类型安全。

所以企业项目里很适合这样分工：

业务过滤：放 query service / repository
全局一致性规则：放 Prisma extension
七、复杂关联查询不要只看代码结构，还要看性能结构

Prisma 官方在 relation query 中提供了 relationLoadStrategy，支持：

join：数据库层合并，默认更适合多数场景
query：多次查询后在应用层拼装

而且官方文档说明，这个能力目前仍与 relationJoins 预览特性相关，PostgreSQL 从 5.8.0 起支持，MySQL 从 5.10.0 起支持。

这对大项目很重要，因为“select 组织得好”不等于“查询就快”。
真正要关注的是：

是否 over-fetch
是否缺索引
是否重复查询
是否把 dashboard 查询写成了接口实时现算

Prisma 的 query optimization 文档明确把 over-fetching、missing indexes、not caching repeated queries 列为常见慢查询原因。

所以建议：

面向接口定义 select
高频聚合查询做缓存
大列表必须分页
热路径配索引
复杂列表先看 SQL plan，再谈“代码优雅”
八、事务边界也要从“大 Service”中抽出来

企业项目里，事务是架构问题，不只是语法问题。

Prisma 官方提供 $transaction([]) 做多操作原子提交；如果是“依赖前一步生成 ID 的写入”，官方建议优先用 nested writes，而不是强行用 $transaction([])。

所以建议你定一个团队规则：

单聚合内创建/更新：优先 nested writes
跨模型独立写操作：$transaction
跨模块业务编排：application use case 控制事务边界
事务内不要塞外部 HTTP 调用
事件发送用 outbox，不要直接在事务里发 MQ
九、适合 NestJS + Prisma 的企业级落地方案

我建议你按这个梯度升级，不要一步到位搞得过重。

第 1 阶段：模块化单体

每个业务域一个 module：

user
auth
order
billing
inventory

每个模块至少拆成：

controller
use cases
repository
query service
selectors
mapper
第 2 阶段：统一 shared 基础设施

抽出：

PrismaModule
ConfigModule
LoggerModule
CacheModule
EventBus/Queue
AuthGuard / PermissionGuard
ExceptionFilter
第 3 阶段：读写分离（仅在必要模块）

对复杂模块启用轻量 CQRS：

commands/
queries/
handlers/

Nest 的 CQRS 能力适合“读模型复杂、写流程复杂、审计要求高”的模块，不要全站铺。

第 4 阶段：边界清晰后再考虑微服务

只有当出现这些信号，才值得拆服务：

团队边界独立
发布节奏冲突
数据所有权已清晰
单体构建/部署/测试成本过高
某些模块吞吐和扩展需求明显不同

不要把微服务当成解决大 Service 的第一步。
先把单体内部边界理顺，收益最大。

十、我会给团队定的几条硬规则
Controller 不写业务逻辑
一个 Service 不超过一个业务角色，超过就拆 use case / query service
select 不允许散写，统一放 \*.select.ts
敏感字段统一 omit
复杂查询走 QueryService，不走通用 CRUD Service
Repository 不做万能基类，不做“全表 CRUD 大集合”
跨模块调用只经模块公开 API，不直接互相摸 Prisma
事务只放在 application use case 边界
读性能问题先查 over-fetch / 索引 / 缓存，不先争论框架
先模块化单体，后 CQRS，最后才是微服务
一个比较稳的最终形态

你可以把 NestJS + Prisma 的企业级结构理解成：

Controller
-> UseCase / QueryHandler
-> Domain Service / Repository
-> Prisma Repository / Prisma Query Service
-> DB

而不是：

Controller
-> XXL Service
-> Prisma everywhere

前者能长期演进；后者 6 个月后基本一定出现：

God Service
select 重复
DTO 混乱
跨模块互相调用
权限逻辑散落
事务边界不清
性能问题难定位
