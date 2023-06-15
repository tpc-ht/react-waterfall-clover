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
  // const images = [
  //   "https://www.leiyouxi.com/wp-content/uploads/2022/10/8qwid.jpg",
  //   "https://img.3dmgame.com/uploads/images/news/20221212/1670810198_320504.png",
  //   "https://img.huanghelou.cc/zb_users/upload/2022/06/202206121655025127298987.jpg",
  //   "https://img.zcool.cn/community/014414577f6f1f0000012e7ead25b6.jpg@1280w_1l_2o_100sh.jpg",
  //   "https://oss.tan8.com/resource/attachment/2018/201808/9b8aa99ab3af3342a335a64c86416313.jpg",
  //   "https://img.zcool.cn/community/013ba35dc24dbda801209e1f04be47.jpg@2o.jpg",
  //   "https://img.huanghelou.cc/zb_users/upload/2022/06/202206121655025127298987.jpg",
  //   "https://img.zcool.cn/community/014414577f6f1f0000012e7ead25b6.jpg@1280w_1l_2o_100sh.jpg",
  //   "https://www.leiyouxi.com/wp-content/uploads/2022/10/8qwid.jpg",
  //   "https://img.3dmgame.com/uploads/images/news/20221212/1670810198_320504.png",
  //   "https://img.huanghelou.cc/zb_users/upload/2022/06/202206121655025127298987.jpg",
  //   "https://oss.tan8.com/resource/attachment/2018/201808/9b8aa99ab3af3342a335a64c86416313.jpg",
  //   "https://img.zcool.cn/community/013ba35dc24dbda801209e1f04be47.jpg@2o.jpg",
  // ];
  return (
    <>
      <Waterfall className="container" col={2} colWidth={180}>
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
