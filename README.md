# fanbox-downloader
pixiv FANBOXの投稿を自動でダウンロードする

自分用

↓ブックマークレット
```
javascript:function main(){if(document.body.innerHTML="","https://downloads.fanbox.cc"!=window.location.origin&&(alert("https://downloads.fanbox.ccで実行してね"),window.location.href="https://downloads.fanbox.cc"),confirm("クリエイターページからダウンロードする？")){if(null==(n=prompt("www.fanbox.cc/@ 以降を入力")))return;var o=prompt("取得制限数を入力");if(null==o)return;addByCreatorId(n,o)}else{var n;if(null==(n=prompt("www.fanbox.cc/@hoge/posts/ 以降を入力")))return;addByPostId(n)}startDownload()}function addByCreatorId(o,n){var t=new XMLHttpRequest;t.open("GET","https://api.fanbox.cc/post.listCreator?creatorId="+o+"&limit="+n,!1),t.send(null);for(var e=JSON.parse(t.responseText).items,a=0;a<e;a++)addByPostId(e[a].id)}function addByPostId(o){var n=new XMLHttpRequest;n.open("GET","https://api.fanbox.cc/post.info?postId="+o,!1),n.send(null);var t=JSON.parse(n.responseText),e=t.body.title,a=t.body.user.name;if("image"==t.body.type)for(var r=t.body.body.images,d=0;d<r.length;d++)addUrl(r[d].originalUrl,a+" - "+e+" "+d+"."+r[d].extension);else if("file"==t.body.type){var l=t.body.body.files;for(d=0;d<l.length;d++)addUrl(l[d].originalUrl,a+" - "+e+" "+l[d].name+"."+l[d].extension)}}function addUrl(o,n){var t=document.createElement("a");document.body.appendChild(t),t.href=o,t.download=n}function startDownload(){var o=document.querySelectorAll("a"),n=0,t=setInterval(function(){o[n].click(),++n>=o.length&&clearInterval(t)},300)}main();
```
