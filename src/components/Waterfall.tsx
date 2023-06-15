import React, {
  FC,
  ReactElement,
  UIEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface WaterfallProps extends React.HTMLAttributes<HTMLDivElement> {
  // 列数
  col?: number;
  // 单边宽度
  width?: number;
  // 间距
  space?: number | number[];
  //缓冲高度
  bufferHeight?: number;
  //图片加载并发数量
  concurrent?: number;
  //item额外参与计算高度
  extraItemHeight?: number;
  //容器滚动事件
  onScroll?: UIEventHandler<HTMLDivElement>;
}

const Waterfall: FC<WaterfallProps> = (props) => {
  const {
    space = 10,
    bufferHeight = 0,
    col = 2,
    width = 200,
    concurrent = 10,
    extraItemHeight = 0,
    children,
    onScroll,
    style,
    ...e
  } = props;
  const loadingRef = useRef(false);
  const containerRef = useRef<any>();
  const { current: rootMap } = useRef(new Map());
  const [end, setEnd] = useState(0);
  const { marginH, marginV } = useMemo(
    () =>
      Array.isArray(space)
        ? {
            marginH: space[0] ?? 10,
            marginV: space[1] ?? 10,
          }
        : {
            marginH: space,
            marginV: space,
          },
    [space]
  );

  const cols = useMemo(
    () =>
      Array(col)
        .fill("")
        .map(() => ({
          height: 0,
          items: [],
        })),
    [col]
  );

  const getLowestCol = () => {
    const minH = Math.min(...cols.map((c) => c.height));
    const col = cols.find((c) => c.height === minH);
    return col;
  };

  const insert = (node: ReactElement, img: ImageData) => {
    const col = getLowestCol();

    col.items.push(node);
    col.height += img.width
      ? img.height * (width / img.width) + marginV + extraItemHeight
      : 0;
    setEnd((n) => n + 1);
  };

  const getImgUrl = (node: ReactElement): string => {
    if (node === null) {
      return null;
    }
    if (Array.isArray(node)) {
      const n = node.find((n) => getImgUrl(n) !== null);
      return n?.props.src;
    }
    if (node.type === "img") {
      return node.props.src;
    } else {
      return getImgUrl(node.props?.children);
    }
  };

  const isOverflow = () => {
    const minH = Math.min(...cols.map((c) => c.height));
    const { clientHeight, scrollTop } = containerRef.current;
    const currentH = clientHeight + bufferHeight + scrollTop;
    if (minH >= currentH) {
      return true;
    } else {
      return false;
    }
  };

  const round = async () => {
    if (loadingRef.current) {
      return;
    }
    if (!Array.isArray(children)) {
      return;
    }
    if (end === children.length) {
      return;
    }
    if (isOverflow()) {
      return;
    }

    loadingRef.current = true;

    const queue = new Array<Promise<any>>();
    const load = (url: string) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img);
      });
    };

    children.slice(end, end + concurrent).forEach((node) => {
      queue.push(load(getImgUrl(node as ReactElement)));
    });

    for (let j = 0; j < queue.length; j++) {
      const img = await queue[j];
      const node = children[end + j];
      insert(node as ReactElement, img);
    }

    loadingRef.current = false;
  };

  useEffect(() => {
    setEnd(0);
    rootMap.clear();
  }, [cols]);

  useEffect(() => {
    round();
  }, [end]);

  const handleScroll: UIEventHandler<HTMLDivElement> = (e) => {
    onScroll?.(e);
    round();
  };

  const cloneElement = (node: ReactElement, index?: number): ReactElement => {
    const isRoot = index !== null && typeof node !== "string";

    if (isRoot) {
      const key = node.key ?? index;
      const cache = rootMap.get(node.key);
      if (cache) {
        return cache;
      } else {
        const root = React.cloneElement(
          node,
          {
            ...node.props,
            style: { width, ...node.props.style },
            key,
          },
          React.Children.map(node.props.children, (child) => {
            return cloneElement(child);
          })
        );
        rootMap.set(root.key, root);
        return root;
      }
    }
    if (node.type === "img") {
      return React.cloneElement(node, {
        style: { objectFit: "contain", width: "100%", ...node.props.style },
      });
    }
    // if (node.props?.children) {
    //   return React.Children.map(node.props.children, (child) =>
    //     cloneElement(child)
    //   );
    // }
    return node;
  };
  return (
    <div
      style={{
        display: "flex",
        overflow: "auto",
        gap: marginH,
        ...style,
      }}
      onScroll={handleScroll}
      ref={containerRef}
      {...e}
    >
      {Array.isArray(children)
        ? cols.map((col, i) => (
            <div
              key={i}
              style={{
                width,
                display: "flex",
                flexDirection: "column",
                gap: marginV,
              }}
            >
              {col.items.map((node, i) => cloneElement(node, i))}
            </div>
          ))
        : children}
    </div>
  );
};

export default Waterfall;
