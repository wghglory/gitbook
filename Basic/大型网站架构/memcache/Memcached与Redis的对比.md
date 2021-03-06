# Memcached 与 Redis 的对比

- 没有必要过多的关心性能，因为**二者的性能都已经足够高**了。由于**Redis 只使用单核**，而**Memcached 可以使用多核**，所以在比较上，平均每一个核上 Redis 在存储小数据时比 Memcached 性能更高。而在**100k 以上的数据中，Memcached 性能要高**于 Redis，虽然 Redis 最近也在存储大数据的性能上进行优化，但是比起 Memcached，还是稍有逊色。说了这么多，结论是，无论你使用哪一个，每秒处理请求的次数都不会成为瓶颈。（比如瓶颈可能会在网卡）
- 如果要说内存使用效率，**使用简单的 key-value 存储的话，Memcached 的内存利用率更高**，而如果 Redis 采用 hash 结构来做 key-value 存储，由于其组合式的压缩，其内存利用率会高于 Memcached。当然，这和你的应用场景和数据特性有关。
- 如果你**对数据持久化和数据同步有所要求，那么推荐你选择 Redis**，因为这两个特性 Memcached 都不具备。即使你只是希望在升级或者重启系统后缓存数据不会丢失，选择 Redis 也是明智的。

**需要慎重考虑的部分**:

- Memcached 单个 key-value 大小有限，**一个 value 最大只支持 1MB，而 Redis 最大支持 512MB**
- Memcached 只是个内存缓存，对可靠性无要求；而 Redis 更倾向于**内存数据库**，因此对对可靠性方面要求比较高
- 从本质上讲，Memcached 只是一个单一 key-value 内存 Cache；而 Redis 则是一个数据结构内存数据库，支持五种数据类型，因此 Redis 除单纯缓存作用外，还可以处理一些简单的逻辑运算，Redis 不仅可以缓存，而且还可以作为数据库用
- 新版本（3.0）的 Redis 是指**集群分布式**，也就是说集群本身均衡客户端请求，各个节点可以交流，可拓展行、可维护性更强大。
- MongoDB 不支持事务。

结论：**在简单的 Key/Value 应用场景（例如缓存），Memcached 拥有更高的读写性能；而在数据持久化和数据同步场景，Redis 拥有更加强大的功能和更为丰富的数据类型**
