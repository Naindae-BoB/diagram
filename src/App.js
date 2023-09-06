import './App.css';
import React , { useEffect } from 'react';
import * as go from 'gojs';
import { ToolManager, Diagram } from 'gojs';
import { ReactDiagram } from 'gojs-react';
import Pallete from './component/Pallete';

function initDiagram() {
  const $ = go.GraphObject.make;
  const diagram =
    $(go.Diagram,
      {
        'undoManager.isEnabled': true,
        'resizingTool.isEnabled': true,
         model: new go.GraphLinksModel({ linkKeyProperty: 'key' }),
        "linkingTool.isEnabled": true, 
        "clickCreatingTool.archetypeNodeData": { text: 'new node', color: 'lightblue' },
      });               

  diagram.addLayerBefore($(go.Layer, { name: "BottomLayer" }), diagram.findLayer("Background"));

  diagram.nodeTemplate =
    $(go.Node, "Auto",
    new go.Binding("layerName", "key", function(key) {
      return key === -5 ? "BottomLayer" : "";  // key가 -5인 노드를 "BottomLayer" 레이어에 추가
    }),
      { resizable: true, resizeObjectName: "SHAPE" },
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.Shape, 
        { name: "SHAPE", fill: "white", strokeWidth: 0 },
        new go.Binding('fill', 'color'),
        new go.Binding('figure')),
      $(go.TextBlock,   
        { margin: 8, editable: true }),
         //new go.Binding('text').makeTwoWay()),
      
      // make the Shape deletable by right-clicking or pressing the Delete key
      {
          contextMenu:
            $("ContextMenu",
              $("ContextMenuButton",
                $(go.TextBlock, "Delete"),
                { click: function(e, obj) { e.diagram.commandHandler.deleteSelection(); } }
              )
            )
       },
       makePort("T", go.Spot.Top),    //각각 다이어그램의 상하좌우에 포트를 생성한다
       makePort("L", go.Spot.Left),
       makePort("R", go.Spot.Right),
       makePort("B", go.Spot.Bottom)
    );
   // enable Ctrl+Z to undo and Ctrl+Y to redo
  
   function makePort(name, spot) {
    return $(go.Shape,
             {
               fill:"transparent",
               stroke:null,
               desiredSize:new go.Size(15,15),    //여기가 노드를 선택하는 포트의 크기를 조정하는 곳
               alignmentFocus : spot,
               alignment : spot.opposite(),
               portId:name,
               fromLinkable:true,
               toLinkable:true
             });
   }

  return diagram;
}

/*function handleModelChange(changes) {
  alert('GoJS model changed!');
}
*/

function App() {
  const nodeDataArrayPalette=[
    { key: -1, text: "Start", figure: "Circle", color: "lightblue" },
    { key: -2, text: "Step", figure: "Rectangle", color: "lightblue" },
    { key: -3, text: "???", figure:"Diamond", color:"lightblue"},
    { key:-4,text:"End",figure:"Circle",color:"lightblue"},
    { key:-5,text:"Group",figure:"Rectangle",color:"lightblue", fill:null}
  ]
  return (
    <div className="App" style={{ display:'flex', flexDirection:'row' }}>
      <ReactDiagram
        initDiagram={initDiagram}
        divClassName='diagram-component'
        nodeDataArray={[
          { key: 0, text: 'Alpha', color: 'lightblue', loc: '0 0' },
          { key: 1, text: 'Beta', color: 'orange', loc: '150 0' },
          { key: 2, text: 'Gamma', color: 'lightgreen', loc: '0 150' },
          { key: 3, text: 'Delta', color: 'pink', loc: '150 150' }
        ]}
        linkDataArray={[
          { key: -1, from: 0, to: 1 },
          { key: -2, from: 0, to: 2 },
          //{ key: -3, from: 1, to: 1 },
          { key: -4, from: 2, to: 3 },
          { key: -5, from: 3, to: 0 }
        ]}
        //onModelChange={handleModelChange}
      />

    <Pallete nodeDataArray={nodeDataArrayPalette} />
    </div>
  );
}

export default App;
