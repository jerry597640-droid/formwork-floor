# 樓板模板設計計算 — 完整原始碼

純 HTML、CSS、JavaScript 網頁；不需 npm 建置、後端或資料庫。
本套件含目前完成版本的全部程式與 Word 匯出字型。

## 功能

- 板材、角材、貫材及支撐輸入、強度與撓度檢核。
- 各構件獨立選擇簡支梁或三等跨、等 EI、全跨均布載重連續梁。
- 樓板厚度自動換算自重：H / 100 × 2.4 tf/m³。
- 容許撓度可選固定 cm 或 L/n；數值顯示最多兩位小數，計算保留完整精度。
- 多組新增、複製、切換、刪除；本機瀏覽器保留草稿。
- 新增組別自動帶入目前第一組的材料尺寸（含跨度）、彈性係數、容許應力、撓度限值及支撐設定；各組均可獨立修改。第一組後續調整只影響之後新增的組別，不回寫已建立的組別。載重與梁分析模式仍以原始預設起始；若需沿用目前組別的全部條件，請使用「複製本組」。
- 單組／多組詳細計算書，列印存成 PDF，匯出真正 .docx Word。
- 計算書採緊湊多欄表格，包含公式、代入數值、結果與檢核。
- 線載重直接由面載重與分攤寬度換算；不使用 α、β 放大係數。

## 在電腦執行

解壓縮後，在本資料夾開啟終端機，已安裝 Python 時執行：

```sh
python -m http.server 8000
```

瀏覽器開啟 http://localhost:8000 。macOS/Linux 可用 python3。
請經由 HTTP 開啟，直接雙擊 index.html 的 file:// 模式可能無法載入 Word 字型。

## GitHub Pages 發布（網頁操作）

1. 登入 GitHub，建立 Public 儲存庫，建議名稱 formwork-floor；可勾選建立 README。
2. 在儲存庫選 Add file → Upload files。
3. 上傳本資料夾內的全部檔案（不是 ZIP，也不是外層資料夾），讓 index.html 位於儲存庫根目錄。以本套件 README 取代初始 README 即可。
4. Commit changes 到 main。report-font.otf 與 report-font-LICENSE.txt 必須一併上傳；字型约 16 MB，可供 Word 嵌入中文字型。
5. Settings → Pages → Source 選 Deploy from a branch，Branch 選 main，資料夾選 /(root)，按 Save。
6. 等待部署完成，從 Pages 頁面的 Visit site 開啟網站。若帳號為 jerry597640-droid、名稱為 formwork-floor，預期網址為 https://jerry597640-droid.github.io/formwork-floor/ 。此為部署完成後的網址，本套件不代表已發布。
7. 後續只需將修改檔案提交到 main，即會重新部署。

官方說明：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 程式檔案

| 檔案 | 用途 |
|---|---|
| index.html | 主畫面、示意圖與模型說明 |
| style.css | 網頁與列印排版 |
| calc.js | 結構計算核心及預設值，可直接在 Node 載入 |
| app.js | 輸入、結果與介面互動 |
| report.js | 詳細計算書、公式及精簡排版 |
| groups.js | 多組資料與合併輸出 |
| word.js | DOCX XML、ZIP 封裝與字型嵌入 |
| report-font.otf | Noto Sans CJK TC 字型 |
| report-font-LICENSE.txt | 字型授權條款 |
| favicon.svg | 網站圖示 |
| .nojekyll | 停用 Jekyll，直接發布靜態檔案 |
| SHA256SUMS.json | 網頁原始檔完整性校驗 |

## 資料與 Word 格式

計算資料僅存在目前瀏覽器的 localStorage，GitHub Pages 不會保存或同步輸入資料；更換網址、瀏覽器或清除網站資料不會自動帶入原草稿。重要計算請匯出留存。
Word 以固定寬度表格與 Unicode 原生文字公式排版，並嵌入 Noto 字型；不是公式圖片，也不是 OMML 方程式物件。不同 Word/WPS/LibreOffice 的分頁仍可能略異；固定頁面交付請使用 PDF。

## 計算範圍

詳細假設與公式已列於網頁「計算模型、適用範圍與輸入假設」及計算書。連續梁限定三等跨、等剛度、全跨均布載重；支撐為所列軸壓檢核。預設 35 cm 樓板厚度用於重現參考報表 0.84 tf/m²，應改為實際工程值。支撐計算新增的 E、Fy、K 假設並非原報表已知參數；完整系統穩定與接頭等需另核實。
