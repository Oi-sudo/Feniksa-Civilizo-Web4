# 凤凰文明数字博物馆｜第七至第十集预备部署说明

**工作分支：** `museum-videos-07-10-staging-20261018`。本分支没有合入 `main`，旧 Netlify 网站暂不受影响。

## 已在 GitHub 预备分支保存的站内 MP4

| 集数 | 展陈名称 | 网页播放文件 | 检查后的时长 |
|---|---|---|---|
| 07 | 灵石·花果山悟空 | `videos/07.mp4` | 130.612秒 |
| 08 | 宇宙神石法像 | `videos/08.mp4` | 194.583秒 |
| 09 | 象形熊猫碳质球粒陨石 | `videos/09.mp4` | 114.010秒 |
| 10 | 火星蓝莓朗斯戴尔钻石陨石 | `videos/10.mp4` | 254.958秒 |

文件均为 Descript 已发布作品的完整时长 H.264/AAC 网页压缩副本，含视频流及音频流。压缩不等于已人工试听每句；导出的画面、配音、字幕同步和听感仍需实际审看。文件 SHA-256 和大小在 `videos/verified-manifest.json`，请以该表为准。

**第十集的重要遗留问题：** 原 Descript 配乐版的音乐偏大，结尾还有多余纯音乐时间。现有 `10.mp4` 仍由该版压缩所得，音量问题没有修正，不能声称是用户要求的三分之一音量修正版。若正式上线前无法修正，应明确标记版本状态或暂不上线此集。

## 正式旧站保护措施

- 保留原站九馆、3D原版内容、十二集影像以及其余原页面。
- 本分支仅新增 `museum/collection-videos/`，并给 `museum/index.html` 增加一个链接。
- 既有 `museum/videos/07.mp4` 等旧片保持不动，新片独立放在 `collection-videos/videos/`，不覆盖原文件。
- 新目录仅使用本站相对 MP4 地址，不以 Descript 域名作为站内视频源。
- 仍须 Netlify 成功部署，并由国内观众实际测试四集完整播放；GitHub 验证不代表已在中国验证。
- Netlify 新部署如仍受额度限制，继续保留旧站线上版本，暂不合并 PR。

## 对照用 Descript 原发布页面（不作为中国观众正式播放入口）

1. https://share.descript.com/view/YtJRs4oVOAh
2. https://share.descript.com/view/WJ3vC2anaES
3. https://share.descript.com/view/K6QetPa2xJZ
4. https://share.descript.com/view/cJ5fyUNIyGM

## 本站构建

`netlify.toml`：`python3 scripts/assemble-originals.py`，发布 `dist`。新 `museum/collection-videos/` 将随构建复制到 `dist`，但正式上线前应通过专门检查任务。

