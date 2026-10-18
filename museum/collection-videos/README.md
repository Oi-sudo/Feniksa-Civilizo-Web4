# 凤凰文明数字博物馆·第七至第十集｜准备分支

本分支仅用于准备旧 Netlify 站点的四集站内视频播放，不修改 `main`，不影响九馆、十二集及27章。

## 视频所需文件（必须使用经观众确认的完整版）

- `museum/collection-videos/videos/07.mp4` — 第七集《灵石·花果山悟空》
- `museum/collection-videos/videos/08.mp4` — 第八集《宇宙神石法像》
- `museum/collection-videos/videos/09.mp4` — 第九集《象形熊猫碳质球粒陨石》
- `museum/collection-videos/videos/10.mp4` — 第十集《火星蓝莓朗斯戴尔钻石陨石》

> 这四个经确认的 MP4 **尚未提交到仓库**。网页会在文件缺失时明确显示未发布，不会把外部 Descript 链接伪装成站内视频。

核对入口（仅用于对照源版本，不能当作中国可访问的正式地址）：

1. https://share.descript.com/view/YtJRs4oVOAh
2. https://share.descript.com/view/WJ3vC2anaES
3. https://share.descript.com/view/K6QetPa2xJZ
4. https://share.descript.com/view/cJ5fyUNIyGM

## 上线前必须逐项确认

1. 取得上述四个原版 MP4 的真实文件，不以缺音/缺字幕的本地预览版代替。
2. MP4 在网站目录内，视频首尾、男声、字幕、轻音乐核对无误。
3. 将 `museum/collection-videos/` 合入主站，并从 `museum/index.html` 增加明确入口；只做增量更改，不覆盖旧内容。
4. Netlify 本期额度恢复后确认部署成功；再由中国境内观众检查四集能打开和播放。

本站构建方式：`netlify.toml` 配置运行 `python3 scripts/assemble-originals.py`，发布 `dist`。因此新增目录放在 `museum/collection-videos/`，会被复制进 dist。

