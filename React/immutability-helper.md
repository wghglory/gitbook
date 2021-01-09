# Immutability-helper 修改 nested array of objects

## 一次操作，只修改某个内嵌 object 的字段

**原数组**：

```javascript
const products = [
  {
    id: '111',
    analysis: [{ id: 1, value: 0 }, { id: 2, value: 0 }, { id: 3, value: 0 }],
  },
  {
    id: '222',
    analysis: [{ id: 1, value: 0 }, { id: 2, value: 0 }, { id: 3, value: 0 }],
  },
];
```

**操作**：根据 productId 和 analysisId 找到 nested object, 只更新他的 value

```javascript
const action = { id: '111', analysisId: 2, value: 99 };
```

**处理代码**：使用 immutability-helper 时需要找到要更新 object 在 array 中的 index。如上面 id=111 对应 index=0，analysisId=2 对应 index=1

```javascript
const newProducts = update(products, {
  0: {
    analysis: {
      1: { $merge: { value: 99 } },
      // 0: { $merge: { value: 99 }}  // 可以一次性更新多个操作，这里只是举例
    },
  },
});
```

**结果**：

```diff
const newProducts = [
            {
                id: '111',
                analysis: [
                    { id: 1, value: 0 },
-                    { id: 2, value: 0 },
+                    { id: 2, value: 99 },
                    { id: 3, value: 0 }
            },
            {
                id: '222',
                analysis: [
                    { id: 1, value: 0 },
                    { id: 2, value: 0 },
                    { id: 3, value: 0 }
                ]
            }
        ]
```

### 如何根据 id 找到 对应的 index

```javascript
const targetProductIndex = products.findIndex((x) => x.id === action.id);
const targetProduct = products.find((x) => x.id === action.id);
const targetAnalysisIndex = targetProduct.analysis.findIndex((x) => x.id === action.analysisId);
const targetAnalysis = targetProduct.analysis.find((x) => x.id === action.analysisId);

const result = update(products, {
  [targetProductIndex]: {
    analysis: {
      [targetAnalysisIndex]: { $merge: { value: action.value } },
    },
  },
});
```

---

## 多次操作

```javascript
const actionArr = [
  { id: '111', analysisId: 1, value: 99 },
  { id: '111', analysisId: 3, value: 99 },
  { id: '222', analysisId: 3, value: 99 },
];
```

以上意味着 3 次操作。第一次找到 productId=111，再找到 analysisId=1，更新他 value 从 0 到 99。剩下两次操作类似。

经过操作后 products 的结果：

```diff
const newProducts = [
            {
                id: '111',
                analysis: [
-                    { id: 1, value: 0 },
+                    { id: 3, value: 99 },
                     { id: 2,  value: 0 },
-                    { id: 3, value: 0, },
+                    { id: 3, value: 99 }
                ]
            },
            {
                id: '222',
                analysis: [
                     { id: 1, value: 0 },
                     { id: 2,  value: 0 },
-                    { id: 3, value: 0 },
+                    { id: 3, value: 99, },
                ]
            }
        ]
```

**处理代码**：

```javascript
const newProducts = update(products, {
  0: {
    analysis: {
      0: { $merge: { value: 99 } },
      2: { $merge: { value: 99 } },
    },
  },
  1: {
    analysis: {
      2: { $merge: { value: 99 } },
    },
  },
});
```

### 如何根据 actionArr 构建 update 语句

#### 思路 1：每循环 actionArr 一次时，进行一次 update 操作，返回第一次操作后的结果，作为第二次 update 的对象。依次，所以用 `reduce`。但这样多次复制对象，不太好

**多个循环积累更新**：

```javascript
const actionArr = [
  { id: '111', analysisId: 1, value: 99 },
  { id: '111', analysisId: 3, value: 99 },
  { id: '222', analysisId: 3, value: 99 },
];

// acc 每次操作积累的结果，cur 是 actionArr 循环中当前对象。首次 acc = products
const result = actionArr.reduce((acc, cur) => {
  const targetIndex = acc.findIndex((x) => x.id === cur.id);
  const target = acc.find((x) => x.id === cur.id);
  const targetAnalysisIndex = target.analysis.findIndex((x) => x.id === cur.analysisId);
  const targetAnalysis = target.analysis.find((x) => x.id === cur.analysisId);

  return update(acc, {
    [targetIndex]: {
      analysis: {
        [targetAnalysisIndex]: { $merge: { value: cur.value } },
      },
    },
  });
}, products);
```

#### 思路 2：循环构建好 update 语句中的对象，之后一次性更新

```javascript
const buildUpdateOperation = (source, actionArr) => {
  let result = {};

  actionArr.forEach((action) => {
    const targetIndex = source.findIndex((x) => x.id === action.id);
    const target = source.find((x) => x.id === action.id);
    const targetAnalysisIndex = target.analysis.findIndex((x) => x.id === action.analysisId);
    const targetAnalysis = target.analysis.find((x) => x.id === action.analysisId);

    if (result[targetIndex]) {
      // 第二次更新同一个 product，但 analysisId 不同
      result[targetIndex].analysis[targetAnalysisIndex] = { $merge: { value: action.value } };
    } else {
      // 首次不存在 index，赋值
      result[targetIndex] = {
        analysis: {
          [targetAnalysisIndex]: { $merge: { value: c.value } },
        },
      };
    }
  });

  return result;
};
```

**生成的结果为**：

```javascripton
{
  0: {
    "analysis": {
      0: { "$merge": { "value": 99 } },
      2: { "$merge": { "value": 99 } }
    }
  },
  1: {
    "analysis": {
      2: { "$merge": { "value": 99 } }
    }
  }
}
```

**一次行更新**：

```javascript
const updateQuery = buildUpdateOperation(products, actionArr);
const newProducts = update(products, updateQuery);
```
