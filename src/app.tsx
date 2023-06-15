// @ts-ignore
import { Random } from "mockjs";
import React, { useMemo } from "react";
import "./app.css";
import Waterfall from "./components/Waterfall";

export default function App() {
  const source = useMemo(
    () =>
      Array(10)
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
