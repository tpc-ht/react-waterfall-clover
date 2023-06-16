import csn from "classnames";
import React, {
  FC,
  ReactElement,
  UIEventHandler,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./index.css";

export interface WaterfallProps extends React.HTMLAttributes<HTMLDivElement> {
  // 列数
  col?: number;
  // 数据
  dataSource?: any[];
  // 链接字段名称
  fieldName?: string;
  // 单边宽度
  colWidth?: number;
  // 间距
  space?: number | number[];
  //item额外参与计算高度
  extraItemHeight?: number;
  //容器滚动事件
  onScroll?: UIEventHandler<HTMLDivElement>;
  // 自定义节点
  renderItem?: (item: any, index: number) => JSX.Element;
}

const getImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = () => resolve(img);
  });
};

const getLowestCol = (cols: any[]) => {
  const minH = Math.min(...cols.map((c) => c.height));
  const col = cols.find((c) => c.height === minH);
  return col;
};

export const Waterfall: FC<WaterfallProps> = (props) => {
  const {
    dataSource = [],
    fieldName = "url",
    space = 10,
    col = 2,
    colWidth = 0,
    extraItemHeight = 0,
    children,
    onScroll,
    renderItem,
    style,
    className,
    ...e
  } = props;
  const containerRef = useRef<any>();
  const [width, setWidth] = useState(colWidth);
  const [list, setList] = useState([]);
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

  useLayoutEffect(() => {
    if (!colWidth) {
      const { clientWidth } = containerRef.current;
      setWidth((clientWidth - marginH * (col - 1)) / 2);
    }
  }, []);
  useEffect(() => {
    if (col && width) {
      const cols = Array(col)
        .fill("")
        .map(() => ({
          height: 0,
          items: [],
        }));
      new Promise((resolve) => {
        let index = 0;
        dataSource.forEach(async (item) => {
          const img = await getImage(item[fieldName]);
          const col = getLowestCol(cols);
          col.items.push(item);
          // 第一个不加间距
          const space = col.items.length > 1 ? marginV : 0;
          col.height += img.width
            ? img.height * (width / img.width) + space + extraItemHeight
            : 0;
          index += 1;
          index == dataSource.length && resolve(cols);
        });
      }).then((cols: any) => {
        setList(cols);
      });
    }
  }, [col, marginV, dataSource, extraItemHeight, width]);

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

  const handleScroll: UIEventHandler<HTMLDivElement> = (e) => {
    onScroll?.(e);
  };
  return (
    <div
      style={{
        display: "flex",
        overflow: "hidden auto",
        gap: marginH,
        ...style,
      }}
      className={csn(className, "waterfall-img")}
      onScroll={handleScroll}
      ref={containerRef}
      {...e}
    >
      {Array.isArray(list) && width
        ? list.map((col, i) => (
            <div
              key={i}
              style={{
                width,
                display: "flex",
                flexDirection: "column",
                gap: marginV,
              }}
            >
              {col.items.map((node, i) =>
                renderItem ? (
                  renderItem(node, i)
                ) : (
                  <div key={`img-${i}`}>
                    <img key={`img-${i}`} src={node[fieldName]} />
                  </div>
                )
              )}
            </div>
          ))
        : children}
    </div>
  );
};

export default Waterfall;
