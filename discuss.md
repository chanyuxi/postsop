1、确定单一源：权限定义在代码，权限分配在数据库。
@packages/access-control 负责定义 permission/capability；数据库只负责 role、user 与 permission 的绑定关系，不负责创造新的权限语义。

2、权限语义要做成代码资产，不要散落字符串。
所有权限码统一从共享包导出，前端、Nest、BFF 都只引用常量和类型，不直接手写 'user.read' 这类字面量。

3、区分“权限定义”和“权限分配”。
定义回答“系统里有哪些能力”；分配回答“谁拥有这些能力”。这两个层次不要混在一起。

4、管理后台只开放角色与组合管理，不开放 permission CRUD。
后台允许创建角色、给角色分配已有权限、给用户绑定角色；不允许新增、删除、修改 permission code。

5、Access Token 承载权限快照，而不是每请求回源查权限。
登录时从数据库计算用户权限，签入 access token；请求时直接使用 token 中的权限快照做鉴权。

6、Redis 只承担会话态，不承担常规权限真相校验。
Redis 适合存 refresh token、session、sid 撤销状态、authzVersion；不建议把“每次请求都查 Redis 权限集”作为默认方案。

7、Nest 鉴权拆成两层：认证层和权限层。
AuthGuard 只处理 token 验证与用户上下文注入；PermissionGuard 只处理 @RequirePermissions(...) 的权限比对，不要把两层职责揉在一起。

8、前端 UI 控制和后端请求控制必须消费同一套权限定义。
前端用于菜单、路由、按钮显隐；后端用于接口拦截。两端语义一致，但安全边界只以后端为准。

9、把 B 端权限和 C 端能力放在同一体系下，但分命名空间。
例如 B 端用 b:user.read、b:order.refund；C 端用 c:feature.ai_chat、c:feature.export_pdf。底层工具统一，业务语义分开。

10、权限只表达“能否做动作”，不要承载数据范围和业务条件。
order.refund 只表示具备退款动作资格；“只能退自己租户的订单”“已结算不可退”应放在 policy/service 层。

11、数据库中的 permissions 表是代码定义的镜像，不是第二真相源。
它的作用是支撑角色分配、后台查询、审计和展示；不要让数据库反向定义权限语义。

12、权限变更后的失效策略要靠版本或会话控制，而不是全链路回源。
角色或权限关系变更后，递增 authzVersion 或撤销相关 session，让旧 token 在刷新或高敏操作时失效。

13、高敏接口可以做二次校验，但普通接口坚持快照鉴权。
普通接口依赖 JWT 权限快照；权限变更、财务操作、危险写操作可以额外校验 sid 或 authzVersion。

14、共享包里除了权限常量，还要提供元信息和工具函数。
至少包含：权限码、权限分组、展示名、hasPermission()、React hook、Nest decorator key，形成完整消费层。

15、所有权限变更都应可审计、可追踪、可重构。
权限新增必须走代码评审；角色分配必须留后台审计；权限废弃要有生命周期，不要直接硬删。

16、优先追求“稳定、清晰、可演进”，不要过早追求“完全动态”。
你现在的 monorepo 场景更适合 code-first + snapshot authz。先把这条主链打稳，再考虑更复杂的动态策略扩展。

17、你的整体目标可以定成一句话：Code-first Capability System。
代码定义能力，数据库分配能力，JWT 传递能力快照，前后端共享能力语义，服务端最终裁决能力是否合法。

18、落地顺序按这个来：先共享定义，再接后端，再接前端，最后接后台。
先建 @packages/access-control；再完成 Nest 的 AuthGuard + PermissionGuard；再接 React/RN 的 UI 控制；最后让后台消费数据库镜像做角色分配。
