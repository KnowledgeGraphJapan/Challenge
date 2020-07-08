/* created by Shusaku Egami (http://idease.info/profile/) */

$(function() {
  /* variables start */
  const kgc = "http://kgc.knowledge-graph.jp/ontology/kgc.owl#";
  const kdsb = "http://kgc.knowledge-graph.jp/data/SpeckledBand/";
  const kddm = "http://kgc.knowledge-graph.jp/data/DancingMen/";
  const kdci = "http://kgc.knowledge-graph.jp/data/ACaseOfIdentity/";
  const kddf = "http://kgc.knowledge-graph.jp/data/DevilsFoot/";
  const kdcm = "http://kgc.knowledge-graph.jp/data/CrookedMan/";
  const rdfs = "http://www.w3.org/2000/01/rdf-schema#";
  const rdf = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";

  var nodes = new vis.DataSet();
  var edges = new vis.DataSet();

  var allNodes = [];
  var allEdges = [];
  /* variables end */

  /* function start */
  function clear() {
    allNodes = [];
    allEdges = [];
    nodes.clear();
    edges.clear();
    network.redraw();
  }

  function getData(endpoint, sparql, baseURI) {
    clear();
    let url = endpoint + "?query=" + encodeURIComponent(sparql);
    $.ajax({
      url: url,
      type: "GET",
      headers: {
	Accept: "application/sparql-results+json"
      },
      success: function(data) {
	let bindings = data.results.bindings;
	let i = 0;
	console.log(bindings);
	while(i < bindings.length) {
	  let s = bindings[i]["s"]["value"];
	  if(baseURI!=undefined) {
	    s = s.replace(baseURI,"kd:");
	  }
	  s = s.replace(kdsb, "kdsb:");
	  s = s.replace(kddm, "kddm:");
	  s = s.replace(kdci, "kdci:");
	  s = s.replace(kddf, "kddf:");
	  s = s.replace(kdcm, "kdcm:");
	  s = s.replace(kgc, "kgc:");
	  let p = bindings[i]["p"]["value"];
	  p = p.replace(rdfs, "rdfs:");
	  p = p.replace(kgc, "kgc:");
	  let o = bindings[i]["o"]["value"];
	  let oType = bindings[i]["o"]["type"];

	  if(baseURI!=undefined){
	    o = o.replace(baseURI,"kd:");
	  }
	  o = o.replace(kdsb, "kdsb:");
	  o = o.replace(kddm, "kddm:");
	  o = o.replace(kdci, "kdci:");
	  o = o.replace(kddf, "kddf:");
	  o = o.replace(kdcm, "kdcm:");
	  o = o.replace(kgc,"kgc:");
	  let nodeS = nodes.get(s);
	  if(nodeS == undefined) {
	    allNodes.push({id: s, label: s, shape: "dot", size: 7, color: { border: "#2B7CE9", background: "#D2E5FF"}});
	  }
	  let nodeO = undefined;
	  if(oType == "uri") {
	    nodeO = nodes.get(o);
	  } else {
	    nodeO = nodes.get(o + "literal");
	  }
	  if(nodeO == undefined) {
	    if(oType == "uri") {
	      allNodes.push({id: o, label: o, shape: "dot", size: 7, color: { border: "#2B7CE9", background: "#D2E5FF"}})
	    } else {
	      if(o != "") {//日本語または英語ラベルがない場合は表示しない
		allNodes.push({id: o + "literal", label: o, title: o,  shape: "box", color: { background: "rgba(255,255,255,0.7)"}});
	      }
	    }
	  }
	  if(oType == "uri") {
	    allEdges.push({from: s, to: o, title: p, arrows: {to: {enabled: true}}});
	  } else {
	    allEdges.push({from: s, to: o + "literal", title: p, arrows: {to: {enabled: true}}});
	  }
	  i=(i+1)|0;
	}
	console.log(allNodes.length);
	nodes.update(allNodes);
	edges.update(allEdges);

	network.setOptions( { physics: true } );
	network.redraw();
      }
    });
  }

  function highlight(text) {
    nodes.update(allNodes);
    edges.update(allEdges);
    network.redraw();
    let items = nodes.get({
      filter: function(item) {
	return item.label.includes(text);
      }
    });
    let hits = items.slice();
    let i = 0;
    while(i < hits.length) {
      hits[i].color = "#F6a610";
      i=(i+1)|0;
    }
    nodes.update(hits);
  }

  function expand(selectNodeId, baseURI) {
    let endpoint = $("#endpoint").val();
    let sparql = "PREFIX kd: <" + baseURI + ">\n"
      + "PREFIX kdsb: <" + kdsb +  ">\n"
      + "PREFIX kddm: <" + kddm +  ">\n"
      + "PREFIX kdci: <" + kdci +  ">\n"
      + "PREFIX kddf: <" + kddf +  ">\n"
      + "PREFIX kdcm: <" + kdcm +  ">\n"
      + "PREFIX kgc: <" + kgc +  ">\n"
      + "SELECT * WHERE {\n"
      + "{ " + selectNodeId + " ?p ?o . }\n"
      + "UNION {?s ?p2 " + selectNodeId + " . }}";
    console.log(sparql)
    let url = endpoint + "?query=" + encodeURIComponent(sparql);
    $.ajax({
      url: url,
      type: "GET",
      headers: {
	Accept: "application/sparql-results+json"
      },
      success: function(data) {
	let bindings = data.results.bindings;
	for(var i=0; i<bindings.length; i++) {
	  //展開ノードが持つプロパティについて
	  if(bindings[i]["p"]) {
	    let o = bindings[i]["o"]["value"];
	    o = o.replace(baseURI, "kd:");
	    o = o.replace(kdsb, "kdsb:");
	    o = o.replace(kddm, "kddm:");
	    o = o.replace(kdci, "kdci:");
	    o = o.replace(kddf, "kddf:");
	    o = o.replace(kdcm, "kdcm:");
	    o = o.replace(kgc, "kgc:");
	    let oType = bindings[i]["o"]["type"];
	    let nodeO = undefined;
	    let p = bindings[i]["p"]["value"];
	    p = p.replace(rdfs, "rdfs:");
	    p = p.replace(kgc, "kgc:");
	    if(oType == "uri") {
	      nodeO = nodes.get(o);
	    } else {
	      nodeO = nodes.get(o + "literal");
	    }
	    if(nodeO == undefined) {
	      if(oType == "uri") {
		allNodes.push({id: o, label: o, shape: "dot", size: 7, color: { border: "#2B7CE9", background: "#D2E5FF"}})
	      } else {
		if(o != "") {//日本語または英語ラベルがない場合は表示しない
		  allNodes.push({id: o + "literal", label: o, title: o,  shape: "box", color: { background: "rgba(255,255,255,0.7)"}});
		}
	      }
	    }
	    if(oType == "uri") {
	      allEdges.push({from: selectNodeId, to: o, title: p, arrows: {to: {enabled: true}}});
	    } else {
	      allEdges.push({from: selectNodeId, to: o + "literal", title: p, arrows: {to: {enabled: true}}});
	    }
	  }
	  //展開ノードの被リンク
	  else {
	    let s = bindings[i]["s"]["value"];
	    s = s.replace(baseURI, "kd:");
	    s = s.replace(kdsb, "kdsb:");
	    s = s.replace(kddm, "kddm:");
	    s = s.replace(kdci, "kdci:");
	    s = s.replace(kddf, "kddf:");
	    s = s.replace(kdcm, "kdcm:");
	    s = s.replace(kgc, "kgc:");
	    let nodeS = undefined;
	    let p2 = bindings[i]["p2"]["value"];
	    p2 = p2.replace(rdfs, "rdfs:");
	    p2 = p2.replace(kgc, "kgc:");
	    nodeS = nodes.get(s);
	    if(nodeS == undefined) {
	      allNodes.push({id: s, label: s, shape: "dot", size: 7, color: { border: "#2B7CE9", background: "#D2E5FF"}})
	    }
	    allEdges.push({from: s, to: selectNodeId, title: p2, arrows: {to: {enabled: true}}});
	  }
	  nodes.update(allNodes);
	  edges.update(allEdges);

	  network.setOptions( { physics: true } );
	}
	console.log(data);
      }
    });
  }

  /* function end */

  /* network confing and main */
  let container = document.getElementById('mynetwork');
  let data = {
    nodes: nodes,
    edges: edges
  };
  let options = {
    edges: {
      smooth: false
    },
    physics: {
      solver: "forceAtlas2Based",
      maxVelocity: 200,
      stabilization: {
	enabled: true,
	iterations: 1000,
	updateInterval: 25
      }
    },
    interaction: {
      hover:true,
      dragNodes: true,
      zoomView: true,
      dragView: true
    }
  };
  var network = new vis.Network(container, data, options);

  /* network config and main */

  /* event handler */

  network.on("doubleClick", function (params) {
    network.setOptions( { physics: false } );
    let selectNodeId = params.nodes[0];
    let baseURI = $("#baseURI").val();
    //ダブルクリックされたオブジェクトがリテラルでないノード
    if(selectNodeId != undefined && selectNodeId.includes("literal") == false) {
      expand(selectNodeId, baseURI);
    }
  });

  $(document).on("click", "#load", function() {
    let sparql = $("#sparql").val();
    let endpoint = $("#endpoint").val();
    let baseURI = $("#baseURI").val();
    getData(endpoint, sparql, baseURI);
  });

  $(document).on("click", "#search", function() {
    let text = $("#search_text").val();
    highlight(text);
  });

  $(document).on("click", "#clear", function() {
    clear();
  });

  $(document).on("click", "#stop", function() {
    network.setOptions( { physics: false } );
  });


  /* event handler end */

});
