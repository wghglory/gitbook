# Array vs Linked list

 

|                              | Array                                    | Linked List                              |
| :--------------------------- | :--------------------------------------- | :--------------------------------------- |
| Cost of accessing an element | O(1)                                     | O(n)                                     |
| Storage feature              | Continuous block                         | Separate                                 |
| Memory requirement           | Fixed size (some may unused); May not be available as a large block; Good for small type, int. | No unused memory; but extra memory for pointer variables; Usually available for multiple small blocks; Good for storing complex type (16 bytes), Node  type (4 byte), totally 20 for one whole (complex)(pointerNode)  -> |
| Cost of inserting an element | At beginning: o(n), shifting all elements by 1 index; At end: o(1); Avg: o(n) | At beginning: o(1); At end: o(n); Avg: o(n) |
| Ease of use                  | Easy                                     | hard                                     |



​    
 

Dynamic list: first allocating a fixed size array in memory. When adding extra elements which above the size, it creates a double size array in new memory address and copies original array to new array, so this is costing.

