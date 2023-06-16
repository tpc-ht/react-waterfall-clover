# react-waterfall-clover
React图片瀑布流

## 特性

- 自定义节点渲染
- 自适应图片大小
- 缓冲高度

![react-waterfall](https://github.com/tpc-ht/react-waterfall-clover/blob/main/public/images/waterfall.gif)

## 使用

```
yarn add react-waterfall
```
```jsx
import { Random } from "mockjs";
import React, { useMemo } from "react";
import "./app.css";
import { Waterfall } from "react-waterfall-clover";

export default function App() {
  const source = useMemo(
    () =>
      Array(30)
        .fill("")
        .map((_, i) => ({
          url: Random.image(
            `${Math.floor(Math.random() * 300)}x${Math.floor(
              Math.random() * 300
            )}`
          ),
        })),
    []
  );
  console.log("source",source);
  
  return (
    <>
      <Waterfall
        className="container"
        col={2}
        dataSource={source}
        colWidth={0}
        onScroll={(e) => {
          console.log("滚动", e);
        }}
        renderItem={(item, index) => (
          <div>
            <img src={item.url} key={index} alt={item} />
            <div>
              <span>666666</span>
            </div>
          </div>
        )}
      />
    </>
  );
}
```

## props

| prop            | 类型                                         | 默认    | 必要  | 描述                 |
| --------------- | ------------------------------------------  | ------- | ----- | -------------------- |
| dataSource      | any[]                                       | []      | true | 数据源                 |
| col             | number                                      | 3       | false | 列数                 |
| fieldName       | string                                      | `url`   | false | 图片字段名             |
| colWidth        | number                                      | 自适应   | false | 列宽度，默认根据列数自适应宽度 |
| space           | number /| number[]                          | 10      | false | 间隙                 |
| extraItemHeight | number                                      | 0       | false | item额外参与计算高度 |
| renderItem      | (item: any, index: number) => JSX.Element   | -       | false | 自定义节点 |
| onScroll        | HTMLDivElement                              | -       | false | 容器滚动事件         |


### `colWidth`

单列宽度不传，默认自动计算宽度

## 注： 请不要在 `Waterfall` 设置 `padding` 和 `margin` 会影响列宽的计算准度