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
javascript:var dlList=new Object;dlList.items=new Array,dlList.postCount=0,dlList.fileCount=0;var isIgnoreFree=!1,isEco=!0;function main(){if("https://downloads.fanbox.cc"==window.location.origin){document.body.innerHTML="";var e=document.createElement("input");e.type="text";var t=document.createElement("input");t.type="button",t.value="ok",document.body.appendChild(e),document.body.appendChild(t),t.onclick=function(){JSON.parse(e.value).items.forEach(e=>{createLink(e.url,e.filename)}),startDownload()}}else if(window.location.origin.includes("fanbox.cc")){if(null==window.location.href.match(/https:\/\/(.*)\.fanbox.cc\/posts\/(\d*)/)){dlList.items=new Array;var o=window.location.href.match(/https:\/\/(.*)\.fanbox.cc\/posts/)[1];isIgnoreFree=confirm("無料コンテンツを省く？");var n=prompt("取得制限数(最大300)を入力 キャンセルで最後まで取得");if(null==n)for(var i=1,l="https://api.fanbox.cc/post.listCreator?creatorId="+o+"&limit=100";null!=l;i++){console.log(i+"回目");l=addByPostListUrl(l,isEco)}else l=addByPostListUrl("https://api.fanbox.cc/post.listCreator?creatorId="+o+"&limit="+n,isEco)}else{addByPostInfo(getPostInfoById(o=window.location.href.match(/https:\/\/(.*)\.fanbox.cc\/posts\/(\d*)/)[2]))}var r=JSON.stringify(dlList);navigator.clipboard.writeText(r),console.log(r),alert("jsonをコピーしました。downloads.fanbox.ccで実行して貼り付けてね")}else alert("ここどこですか")}function addByPostListUrl(e,t){var o=JSON.parse(fetchUrl(e)),n=o.body.items;console.log("投稿の数:"+n.length);for(var i=0;i<n.length;i++)dlList.postCount++,1==t?(console.log(n[i]),addByPostInfo(n[i])):addByPostInfo(getPostInfoById(n[i].id));return o.body.nextUrl}function fetchUrl(e){var t=new XMLHttpRequest;return t.open("GET",e,!1),t.withCredentials=!0,t.send(null),t.responseText}function getPostInfoById(e){return JSON.parse(fetchUrl("https://api.fanbox.cc/post.info?postId="+e)).body}function addByPostInfo(e){var t=e.title,o=e.publishedDatetime;if(!isIgnoreFree||0!=e.feeRequired)if(null!=e.body)if("image"==e.type)for(var n=e.body.images,i=0;i<n.length;i++)addUrl(n[i].originalUrl,o+" "+t+" "+(i+1)+"."+n[i].extension);else if("file"==e.type){var l=e.body.files;for(i=0;i<l.length;i++)addUrl(l[i].url,o+" "+t+" "+l[i].name+"."+l[i].extension)}else if("article"==e.type){var r=e.body.imageMap,a=Object.keys(r);for(i=0;i<a.length;i++)addUrl(r[a[i]].originalUrl,o+" "+t+" "+(i+1)+"."+r[a[i]].extension);var s=e.body.fileMap,d=Object.keys(s);for(i=0;i<d.length;i++)addUrl(s[d[i]].url,o+" "+t+" "+s[d[i]].name+"."+s[d[i]].extension)}else console.log("不明なタイプ\n"+e.type+"@"+e.id);else console.log("取得できませんでした(支援がたりない？)\nfeeRequired: "+e.feeRequired+"@"+e.id)}function addUrl(e,t){var o=new Object;o.url=e,o.filename=t,dlList.fileCount++,dlList.items.push(o)}function createLink(e,t){var o=document.createElement("a");document.body.appendChild(o),o.href=e,o.download=t}function startDownload(){var e=document.querySelectorAll("a"),t=0,o=setInterval(function(){e[t].click(),++t>=e.length&&clearInterval(o)},300)}main();
```

### 素晴らしいfork

機能強化版っぽい

- https://furubarug.github.io/fanbox-downloader/
