# fanbox-downloader
pixiv FANBOXの投稿を自動でダウンロードする

自分用、性欲駆動開発

### 使い方
1. ブックマークに追加する
2. FANBOXのクリエイターページ(xxxxxxxxx.fanbox.cc/post)か投稿ページ(xxxxxxxxx.fanbox.cc/post/xxxxxxxx)で実行する
3. URLのリストがjsonでクリップボードに吐き出される
4. download.fanbox.ccでまた実行、jsonをコピペ
5. なんかいっぱいダウンロードはじまる

### 既知の問題
- type: textに対応してない
- 画像とファイルだけじゃなくて文章も保存したいね
- 画像以外でファイル名の規則が適用されない（たぶんレスポンスヘッダ側のファイル名を優先しちゃってる）
- サブドメインになってるパターンと@になってるパターンどっちがいいのかわからん（なんとなく前者にしてみた、そのうち両方対応させる）

↓ブックマークレット
```
javascript:var dlList={};dlList.items=[],dlList.postCount=0,dlList.fileCount=0;var isIgnoreFree=!1,isEco=!1;function main(){if("https://downloads.fanbox.cc"==window.location.origin){document.body.innerHTML="";var t=document.createElement("input");t.type="button",t.value="paste & start",document.body.appendChild(t),t.onclick=function(){navigator.clipboard.readText().then(t=>{JSON.parse(t).items.forEach(t=>{createLink(t.url,t.filename)}),startDownload()})}}else if(window.location.origin.includes("fanbox.cc")){var e=window.location.href,o=null==e.match(/https:\/\/.*\.fanbox.cc\/.*posts\/(\d*)/),n=(e.match(/https:\/\/www\.fanbox.cc\/@(.*)\/posts/)??e.match(/https:\/\/(.*)\.fanbox.cc\/posts/))[1];if(o){dlList.items=[],isIgnoreFree=confirm("無料コンテンツを省く？");var i=prompt("取得制限数(最大300)を入力 キャンセルで最後まで取得");if(null==i)for(var a=1,r="https://api.fanbox.cc/post.listCreator?creatorId="+n+"&limit=100";null!=r;a++){console.log(a+"回目");var r=addByPostListUrl(r,isEco)}else var r=addByPostListUrl("https://api.fanbox.cc/post.listCreator?creatorId="+l+"&limit="+i,isEco)}else{var l=e.match(/https:\/\/(.*)\.fanbox.cc\/.*posts\/(\d*)/)[2];addByPostInfo(getPostInfoById(l))}var s=JSON.stringify(dlList);navigator.clipboard.writeText(s),console.log(s),alert("jsonをコピーしました。downloads.fanbox.ccで実行して貼り付けてね")}else alert("ここどこですか")}function addByPostListUrl(t,e){var o=JSON.parse(fetchUrl(t)),n=o.body.items;console.log("投稿の数:"+n.length);for(var i=0;i<n.length;i++)dlList.postCount++,!0==e?(console.log(n[i]),addByPostInfo(n[i])):addByPostInfo(getPostInfoById(n[i].id));return o.body.nextUrl}function fetchUrl(t){var e=new XMLHttpRequest;return e.open("GET",t,!1),e.withCredentials=!0,e.send(null),e.responseText}function getPostInfoById(t){return JSON.parse(fetchUrl("https://api.fanbox.cc/post.info?postId="+t)).body}function addByPostInfo(t){var e=t.title,o=t.publishedDatetime;if(!isIgnoreFree||0!=t.feeRequired){if(null==t.body){console.log("取得できませんでした(支援がたりない？)\nfeeRequired: "+t.feeRequired+"@"+t.id);return}if("image"==t.type)for(var n=t.body.images,i=0;i<n.length;i++)addUrl(n[i].originalUrl,o+" "+e+" "+(i+1)+"."+n[i].extension);else if("file"==t.type)for(var a=t.body.files,i=0;i<a.length;i++)addUrl(a[i].url,o+" "+e+" "+a[i].name+"."+a[i].extension);else if("article"==t.type){for(var r=t.body.imageMap,l=Object.keys(r),i=0;i<l.length;i++)addUrl(r[l[i]].originalUrl,o+" "+e+" "+(i+1)+"."+r[l[i]].extension);for(var s=t.body.fileMap,d=Object.keys(s),i=0;i<d.length;i++)addUrl(s[d[i]].url,o+" "+e+" "+s[d[i]].name+"."+s[d[i]].extension)}else console.log("不明なタイプ\n"+t.type+"@"+t.id)}}function addUrl(t,e){var o={};o.url=t,o.filename=e,dlList.fileCount++,dlList.items.push(o)}function createLink(t,e){var o=document.createElement("a");document.body.appendChild(o),o.href=t,o.download=e}function startDownload(){var t=document.querySelectorAll("a"),e=0,o=setInterval(function(){t[e].click(),++e>=t.length&&clearInterval(o)},300)}main();
```

### 素晴らしいfork

機能強化版っぽい

- https://furubarug.github.io/fanbox-downloader/
