# 1. Database Partitioning Options

![master-slave](http://om1o84p1p.bkt.clouddn.com/2017-04-12-master-slave.png)


### Cluster Computing

Cluster computing utilizes many servers operating in a group, with shared messaging between the nodes of the cluster. Most often this scenario relies on a centralized shared disk facility, typically a Storage Area Network (SAN). Each node in the cluster runs a single instance of the database server, operating in various modes:

* For high-availability, many nodes in the cluster can be used for reads, but only one for write (CRUD) operations. This can make reads faster, but write transactions do not see any benefit. If a failure of one node occurs, then another node in the cluster takes over, again continuing to operating against the shared disk facility. This approach has limited scalability due to the single bottleneck for CRUD operations. Even the reads will ultimately hit a performance limit as the centralized shared disk facility can only spread the load so much before diminishing returns are experienced. The read limitations are particularly evident when an application requires complex joins or contains non-optimized SQL statements.

* More advanced clustering techniques rely on real-time memory replication between nodes, keeping the memory image of nodes in the cluster up to date via a real-time messaging system. This allows each node to operate in both read or write mode, but is ultimately limited by the amount of traffic that can be transmitted between nodes (using a typical network or other high-speed communication mechanism). Therefore, as nodes are added, the communication and memory replication overhead increases geometrically, thus hitting severe scalability limits, often with a relatively small number of nodes. This solution also suffers from the same shared disk limitations of a traditional cluster, given that a growing, single large database has increasingly intensive disk I/O.
    
![cluster-computing](http://om1o84p1p.bkt.clouddn.com/2017-04-12-cluster-computing.png)

### Table Partitioning

data in a single large table can be split across multiple disks for improved disk I/O utilization. The partitioning is typically done horizontally (separating rows by range across disk partitions), but can be vertical in some systems as well (placing different columns on separate partitions). This approach can help reduce the disk I/O bottleneck for a given table, 

**disadvantage:**

1. make joins and other operations slower. 
2. since the approach relies on a single server instance of the database management system, all other CPU and memory contention limitations apply

![](http://om1o84p1p.bkt.clouddn.com/2017-04-12-14897731429376.jpg)


### Federated Tables

An offshoot of Table Partitioning is the Federated Table approach, where tables can be accessed across multiple servers. 

**disadvantage:** 

1. complex to administer, and lacks efficiency as the federated tables must be accessed over the network. 
2. This approach may work for some reporting or analytical tasks, but for general read/write transactions it is not a very likely choice.

### Sum of Partitioning Options

The common drawback is reliance on shared facilities and resources. Whether relying on shared memory, centralized disk, or processor capacity they each suffer with scalability limitations, not to mention many other drawbacks, including complex administration, lack of support for critical business requirements, and high availability limitations.

# 2. Database Sharding, The “Shared-Nothing” Approach

==breaking up big database into many smaller databases that share nothing and can be spread across multiple servers.==

[![database sharding figure 2](http://om1o84p1p.bkt.clouddn.com/2017-04-12-300x300xdatabase-sharding-figure-2-300x300.jpg.pagespeed.ic.PfKCz_tFoS.jpg)](http://www.agildata.com/wp-content/uploads/2016/05/database-sharding-figure-2.jpg)

### Usage: 

customerWest vs customerEast; customerEurope vs customerUS

### advantage:

* **improved scalability**, growing in a near-linear fashion as more servers are added to the network
* **Smaller databases are easier to manage.** 
* **Smaller databases are faster.** By hosting each shard database on its own server, the ratio between memory and data on disk is greatly improved, thereby reducing disk I/O. This results in less contention for resources, *greater join performance, faster index searches, and fewer database locks*. 
* **Database Sharding can reduce costs.** Most Database Sharding implementations take advantage of lower-cost open source databases, or can even take advantage of “workgroup” versions of commercial databases. Additionally, sharding works well with commodity multi-core server hardware, far less expensive than high-end multi-CPU servers and expensive SANs. The overall reduction in cost due to savings in license fees, software maintenance and hardware investment is substantial, in some cases 70% or more when compared to other solutions.

### things to be considered

* **Reliability.**
    * Automated backups of individual Database Shards.
    * Database Shard redundancy, ensuring at least 2 “live” copies of each shard are available in the event of an outage or server failure. This requires a high-performance, efficient, and reliable replication mechanism.
    * Cost-effective hardware redundancy, both within and across servers.
    * Automated failover when an outage or server failure occurs.
    * Disaster Recovery site management.
* **Distributed queries.**
    * Aggregation of statistics, requiring a broad sweep of data across the entire system. Such an example is the computation of sales by product, which ordinarily requires evaluation of the entire database.
    * Queries that support comprehensive reports, such as listings of all individual customers that purchased a given product in the last day, week or month.
* **Avoidance of cross-shard joins.**The primary technique to avoid this is the replication of Global Tables, the relatively static lookup tables that are common utilized when joining to much larger primary tables. Tables containing values as Status Codes, Countries, Types, and even Products fall into this category. What is required is an automated replication mechanism that ensures values for Global Tables are in synch across all shards, minimizing or eliminating the need for cross-shard joins.
* **Auto-increment key management.** Typical auto-increment functionality provided by database management systems generate a sequential key for each new row inserted into the database. This is fine for a single database application, but when using Database Sharding, keys must be managed across all shards in a coordinated fashion. The requirement here is to provide a seamless, automated method of key generation to the application, one that operates across all shards, ensuring that keys are unique across the entire system.
* **Support for multiple Shard Schemes.** It is important to note that Database Sharding is effective because it offers an application specific technique for massive scalability and performance improvements. In fact it can be said that the degree of effectiveness is directly related to how well the sharding algorithms themselves are tailored to the application problem at hand. What is required is a set of multiple, flexible shard schemes, each designed to address a specific type of application problem. Each scheme has inherent performance and/or application characteristics and advantages when applied to a specific problem domain. In fact, using the wrong shard scheme can actually inhibit performance and the very results you are trying to obtain. It is also not uncommon for a single application to use more than one shard scheme, each applied to a specific portion of the application to achieve optimum results. Here is a list of some common shard schemes:
    * Session-based sharding, where each individual user or process interacts with a specific shard for the duration of the user or process session. This is the simplest technique to implement, and adds virtually zero overhead to overall performance, since the sharding decision is made only once per session. Applications which can benefit from this approach are often customer-centric, where all data for a given customer is contained in a single shard, and that is all the data that the customer requires.
    * Transaction-based sharding determines the shard by examining the first SQL Statement in a given database transaction. This is normally done by evaluating the “shard key” value used in the statement (such as an Order Number), and then directing all other statements in the transaction to the same shard.
    * Statement-based sharding is the most process intensive of all types, evaluating each individual SQL Statement to determine the appropriate shard to direct it to. Again, evaluation of the shard key value is required. This option is often desirable on high-volume, granular transactions, such as recording phone call records.
* Determine the optimum method for sharding the data. This is another area that is highly variable, change from application to application. It is closely tied with the selection of the Database Shard Scheme described above. There are numerous methods for deciding how to shard your data, and its important to understand your transaction rates, table volumes, key distribution, and other characteristics of your application. This data is required to determine the optimum sharding strategy:
    * Shard by a primary key on a table. This is the most straightforward option, and easiest to map to a given application. However, this is only effective if your data is reasonably well distributed. For example, if you elected to shard by Customer ID (and this is a sequential numeric value), and most of your transactions are for new customers, very little if anything will be gained by sharding your database. On the other hand, if you can select a key that does adequately and naturally distribute your transactions, great benefits can be realized.
    * Shard by the modulus of a key value. This option works in a vast number of cases, by applying the modulus function to the key value, and distributing transactions based on the calculated value. In essence you can predetermine any number of shards, and the modulus function effectively distributes across your shards on a “round-robin” basis, creating a very even distribution of new key values.
    * Maintain a master shard index table. This technique involves using a single master table that maps various values to specific shards. It is very flexible, and meets a wide variety of application situations. However, this option often delivers lower performance as it requires an extra lookup for each sharded SQL Statement.

## When Database Sharding is Appropriate

* High-transaction database applications
* Mixed workload database usage
    * Frequent reads, including complex queries and joins
    * Write-intensive transactions (CRUD statements, including INSERT, UPDATE, DELETE)
    * Contention for common tables and/or rows
* General Business Reporting
    * Typical “repeating segment” report generation
    * Some data analysis (mixed with other workloads)

Database Sharding is a method of “horizontal” portioning, meaning that database rows (as opposed to columns) for a single schema table are distributed across multiple shards. To understand the characteristics of how well sharding fits a given situation, here are the important things to determine:

* Identify all transaction-intensive tables in your schema.
* Determine the transaction volume your database is currently handling (or is expected to handle).
* Identify all common SQL statements (SELECT, INSERT, UPDATE, DELETE), and the volumes associated with each.
* Develop an understanding of your “table hierarchy” contained in your schema; in other words the main parent-child relationships.
* Determine the “key distribution” for transactions on high-volume tables, to determine if they are evenly spread or are concentrated in narrow ranges.

With this information, you can rapidly gain an assessment of the value and applicability of sharding to your application. As an example, here is a simple Bookstore schema showing how the data can be sharded:

[![database sharding figure 3](http://om1o84p1p.bkt.clouddn.com/2017-04-12-554x415xdatabase-sharding-figure-3.jpg.pagespeed.ic.I1eonHwGvP.jpg)](http://www.agildata.com/wp-content/uploads/2016/05/database-sharding-figure-3.jpg)

**Figure 3\. Example Bookstore schema showing how data is sharded.**

In the Bookstore example, the Primary Shard Table is the ‘customer’ entity. This is the table that is used to shard the data. The ‘customer’ table is the parent of the shard hierarchy, with the ‘customer_order’ and ‘order_item’ entities as child tables. The data is sharded by the ‘customer.id’ attribute, and all related rows in the child tables associated with a given ‘customer.id’ are sharded as well. The Global Tables are the common lookup tables, which have relatively low activity, and these tables are replicated to all shards to avoid cross-shard joins.

## Disadvantages of sharding

Sharding a database table before it has been optimized locally causes premature complexity. Sharding should be used only when all other options for optimization are inadequate. The introduced complexity of database sharding causes the following potential problems:

- **Increased complexity of SQL** - Increased bugs because the developers have to write more complicated SQL to handle sharding logic.
- **Sharding introduces complexity** - The sharding software that partitions, balances, coordinates, and ensures integrity can fail.
- **Single point of failure** - Corruption of one shard due to network/hardware/systems problems causes failure of the entire table.
- **Failover servers more complex** - Failover servers must themselves have copies of the fleets of database shards.
- **Backups more complex** - Database backups of the individual shards must be coordinated with the backups of the other shards.
- **Operational complexity added** - Adding/removing indexes, adding/deleting columns, modifying the schema becomes much more difficult.






