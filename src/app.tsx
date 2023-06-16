// @ts-ignore
import { Random } from "mockjs";
import React, { useMemo } from "react";
import "./app.css";
import Waterfall from "./components/Waterfall";

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
  console.log("source", source);

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
