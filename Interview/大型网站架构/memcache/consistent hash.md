# [System Design for Big Data [Consistent Hashing]](http://n00tc0d3r.blogspot.com/2013/09/big-data-consistent-hashing.html)

Given *n* cache hosts, an intuitive hash function is `key % n`. It is simple and commonly used. But it has two major drawbacks:

- It is NOT *horizontally scalable*.

  **Every time when adding one new cache host to the system, all existing mappings are broken**. It will be a pain point in maintenance if the caching system contains a lot of data. Also, if the caching system is behind a popular service, it is not easy to schedule a downtime to update all caching mappings.

- It may NOT be *load balanced*, especially for non-uniformly distributed data.

  In real world, it is less likely that the data is uniformly distributed. Then for the caching system, it results that **some caches are hot and saturated while the others idle and almost empty**. In such situations, consistent hashing is a good way to improve the caching system.

### What is Consistent Hashing?

[Consistent Hashing](http://en.wikipedia.org/wiki/Consistent_hashing) is a hashing strategy such that when the hash table is resized (e.g. a new cache host is added to the system), only *k/n* keys need to be remapped, where *k* is the number of keys and *n* is the number of caches. Recall that in a caching system using the mod as hash function, all keys need to be remapped.

Consistent hashing maps an object to the same cache host if possible. If a cache host is removed, the objects on that host will be shared by other hosts; If a new cache is added, it takes its share from other hosts without touching other shares.

### When to use Consistent Hashing?

Consistent hashing is a very useful strategy for distributed caching system and [distributed hash tables](http://en.wikipedia.org/wiki/Distributed_hash_table).
It can reduce the impact of host failures. It can also make the caching system more easier to scale up (and scale down).

Example of uses include:

- Last.fm: [memcached client with consistent hashing](http://www.last.fm/user/RJ/journal/2007/04/10/rz_libketama_-_a_consistent_hashing_algo_for_memcache_clients)
- Amazon: internal scalable key-value store, [Dynamo](http://s3.amazonaws.com/AllThingsDistributed/sosp/amazon-dynamo-sosp2007.pdf)
- [Chord](https://github.com/sit/dht/wiki): a distributed hash table by MITHow it works? As a typical hash function, consistent hashing maps a key or a cache host to an integer.

Suppose the output of the hash function are in the range of [0, 2^128) (e.g. [MD5](http://en.wikipedia.org/wiki/MD5) hash). Image that the integers in the range are placed on a ring such that the values are wrapped around.

### Here's how consistent hashing works:

Given a list of cache servers, hash them to integers in the range. To map a key to a server, hash it to a single integer. Move clockwise on the ring until finding the first cache it encounters. That cache is the one that contains the key. See animation below as an example: key1 maps to cache A; key2 maps to cache C. 

[![img](http://2.bp.blogspot.com/-FoDbp5aJxmo/Uj9IbZgCMpI/AAAAAAAAEjw/gIacbrT174s/s1600/feiche_6.gif)](http://2.bp.blogspot.com/-FoDbp5aJxmo/Uj9IbZgCMpI/AAAAAAAAEjw/gIacbrT174s/s1600/feiche_6.gif)

To add a new cache, say D, keys that were originally falling to C will be split and some of them will be moved to D. Other keys don't need to be touched.

To remove a cache or if a cache failed, say C, all keys that were originally mapping to C will fall into A and only those keys need to be moved to A. Other keys don't need to be touched.

### Now let's consider the load balance issue.

As we discussed at the beginning, the real data are essentially randomly distributed and thus may not be uniform. It may cause the keys on caches are unbalanced.

To resolve this issue, we add "**virtual replicas**" for caches.
For each cache, instead of mapping it to a single point on the ring, we map it to multiple points on the ring, i.e. replicas. By doing this, each cache is associated with multiple segments of the ring.

[![img](http://2.bp.blogspot.com/-_sG8zBqb4ug/Uj9RLNk7E8I/AAAAAAAAEkA/S8vGVnqdf5M/s1600/feiche_7.gif)](http://2.bp.blogspot.com/-_sG8zBqb4ug/Uj9RLNk7E8I/AAAAAAAAEkA/S8vGVnqdf5M/s1600/feiche_7.gif)

If the hash function "[mixes well](http://en.wikipedia.org/wiki/Hash_function#Uniformity)", as the number of replicas increases, the keys will be more balanced. 

### Monotone Keys

If keys are known to be monotonically increased, binary searching can be used to improve the performance of locating a cache for a given key. Then the locate time can be reduced to O(logn).

