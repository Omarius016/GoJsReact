import React, { useRef, useEffect } from "react";
import * as go from "gojs";

const SequenceDiagram: React.FC = () => {
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!diagramRef.current) return;

    // Crear el diagrama
    const $ = go.GraphObject.make;
    const diagram = $(go.Diagram, diagramRef.current, {
      "undoManager.isEnabled": true, // Habilitar deshacer/rehacer
    });

    // Configurar la herramienta de enlace para permitir solo enlaces hacia adelante
    diagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;

    // Plantilla de nodos
    diagram.nodeTemplate = $(
      go.Node,
      "Auto",
      { locationSpot: go.Spot.Center },
      $(go.Shape, "Rectangle", { fill: "lightblue", strokeWidth: 0 }),
      $(go.TextBlock, { margin: 8, editable: true }, // Texto editable
        new go.Binding("text", "key").makeTwoWay())
    );

    // Plantilla de enlaces
    diagram.linkTemplate = $(
      go.Link,
      { routing: go.Link.Orthogonal, corner: 5, relinkableFrom: true, relinkableTo: true },
      $(go.Shape), // Línea del enlace
      $(go.Shape, { toArrow: "Standard" }), // Flecha
      $(go.TextBlock, { segmentOffset: new go.Point(0, -10), editable: true }, // Texto editable
        new go.Binding("text", "text").makeTwoWay())
    );

    // Crear un modelo inicial con nodos y enlaces
    diagram.model = new go.GraphLinksModel(
      [
        { key: "Actor" }, // Nodo 1
        { key: "Objeto" } // Nodo 2
      ],
      [
        { from: "Actor", to: "Objeto", text: "Mensaje" } // Enlace entre nodos
      ]
    );

    // Limpiar el diagrama al desmontar el componente
    return () => {
      diagram.div = null; // Desvincula el diagrama del contenedor
    };
  }, []);

  return (
    <div
      ref={diagramRef}
      style={{
        width: "100%",
        height: "400px", // Altura fija para el lienzo
        border: "1px solid black",
        backgroundColor: "white", // Fondo blanco para evitar pantalla negra
      }}
    />
  );
};

export default SequenceDiagram;