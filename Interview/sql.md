### sql performance

- Avoid Multiple Joins in a Single Query
- Eliminate Cursors from the Query
    Try to remove cursors from the query and use set-based query; set-based query is more efficient than cursor-based. If there is a need to use cursor than avoid dynamic cursors as it tends to limit the choice of plans available to the query optimizer. For example, dynamic cursor limits the optimizer to using nested loop joins.
- Use of Indexes
- Use join instead of subquery if possible
- avoid select *
- avoid count * asterisk 
- normalization 
- denormalization for performance in large app
- database sharding, partition. Master read/write

### Debugging in SQL

