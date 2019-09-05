# サンプルクエリ
ナレッジグラフ推論チャレンジ2019用の「ナレッジグラフ」を対象としたSPARQLクエリのサンプルです．  

SPARQLエンドポイントは，http://lod.hozo.jp/repositories/kgc2019 です．

## 場面の一覧を取得する
```
PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX kgc: <http://kgc.knowledge-graph.jp/ontology/kgc.owl#>

select ?s 
where{
?s rdf:type kgc:Situation .
}
```
[クエリ結果を見る](http://lod.hozo.jp/repositories/kgc2019#query/d/PREFIX%20rdf:%20%20%3Chttp://www.w3.org/1999/02/22-rdf-syntax-ns%23%3E%0APREFIX%20kgc:%20%3Chttp://kgc.knowledge-graph.jp/ontology/kgc.owl#%3E%0A%0Aselect%20?s%20%0Awhere%7B%0A?s%20rdf:type%20kgc:Situation%20.%0A%7D)



