// @ts-ignore
import { Random } from "mockjs";
import React, { useMemo, useState } from "react";
import "./app.css";
import Waterfall from "./components/Waterfall";

export default function App() {
  const [p, setP] = useState(0);
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
  console.log("source", source);

  return (
    <div style={{ padding: p }} className="container">
      <div onClick={() => setP((e) => (e ? 0 : 8))}>点击</div>
      <Waterfall
        col={2}
        dataSource={source}
        onScroll={(e) => {
          console.log("滚动", e);
        }}
        renderItem={(item, index) => (
          <div>
            <img src={item.url} key={index} alt={item} />
            <div>666666666666666666666666666666666666666666666666666666</div>
          </div>
        )}
      />
    </div>
  );
}
