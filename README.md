# react-waterfall-clover
可动态加载的React图片瀑布流


## 特性

- 约定传入`img`标签
- 无需提前传入图片高度
- 自适应图片大小
- 动态加载瀑布流
- 自定义并发加载数量
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
import Waterfall from "./components/Waterfall";

export default function App() {
  // 随机图片生成
  const source = useMemo(
    () =>
      Array(50)
        .fill("")
        .map((_, i) =>
          Random.image(
            `${Math.floor(Math.random() * 500)}x${Math.floor(
              Math.random() * 500
            )}`
          )
        ),
    []
  );
  return (
    <>
      <Waterfall className="container" col={2} width={180}>
        {source.map((url, i) => (
          <div>
            <img src={url} key={i} alt={url} />
            <div>
              <span>666666</span>
            </div>
          </div>
        ))}
      </Waterfall>
    </>
  );
}
```


### ⚠️重要

约定：**传入`img`标签，并赋予`src`属性**

> 图片插入第几列，由获取到的图片高度计算得到

```jsx
      <Waterfall>
        {['url_0,url_1,url_2'].map((url, i) => (
          <img src={url} key={i} />
        ))}
      </Waterfall>
```

约定：**`img`标签可嵌套，但尽量唯一**

> 如果子节点中包含多个`img`标签，只取深度优先第一个获取到的img高度，很可能导致高度计算不准确，插入位置错乱的情况

```jsx
      <Waterfall>
        {['url_0,url_1,url_2'].map((url, i) => (
          <div className="item">
            <img src={url} key={i} />
            <div>others</div>
          </div>
        ))}
      </Waterfall>
```

❌ 尽量避免下面的写法

```jsx
    <Waterfall>
      {['url_0,url_1,url_2'].map((url, i) => (
        <div className="item">
          <img src={url} key={i} />
          <div>
            {/* ❌避免一个item中出现多个img标签 */}
            <img src={url} key={i} />
          </div>
        </div>
      ))}
    </Waterfall>
```


## props

| prop            | 类型           | 默认 | 必要  | 描述                 |
| --------------- | -------------- | ---- | ----- | -------------------- |
| col             | number         | 3    | false | 列数                 |
| colWidth        | number         | 自适应  | false | 列宽度，默认根据列数自适应宽度 |
| space           | number /| number[]         | 10   | false | 间隙           |
| bufferHeight    | number         | 0    | false | 缓冲高度             |
| concurrent      | number         | 10   | false | 图片加载并发数量     |
| extraItemHeight | number         | 0    | false | item额外参与计算高度 |
| onScroll        | HTMLDivElement | -    | false | 容器滚动事件         |


### `width`

统一宽度，会为每项item设置此宽度，item的高度无需设置

如需修改适应方式，直接在`img`标签中修改即可

```jsx
      <Waterfall width={500}>
        {['url_0,url_1,url_2'].map((url, i) => (
          // 每个item的宽度都会设置为500
          <div className="item">
            <img src={url} key={i} />
            <div>others</div>
          </div>
        ))}
      </Waterfall>
```


### `concurrent`

并发数量，即图片一次性加载数量

例如`concurrent={10}`，则图片一次性加载10张，随着向下滚动，触发后续加载，则再次加载10张


### `bufferHeight`

缓冲高度，组件首次会一次性加载`concurrent`张，如果未超过`容器高度`+`缓冲高度`，则会立刻再次加载`concurrent`张，直到超过

用户向下滚动时，`bufferHeight`同样参与计算


### `extraItemHeight`

额外高度，item默认为img图片提供的高度

item高度 = 图片高度 + 其余子节点高度 = 图片高度 + `extraItemHeight`

不传入`extraItemHeight`一般不会造成插入顺序的错误，但可能会引起滚动触发加载不准确的问题

```jsx
      <Waterfall extraItemHeight={20}>
        {['url_0,url_1,url_2'].map((url, i) => (
          <div className="item">
            <img src={url} key={i} />
            <div style={{ height: '20px' }}>others</div>
          </div>
        ))}
      </Waterfall>
```
