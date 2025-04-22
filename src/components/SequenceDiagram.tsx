import React, { useRef, useEffect } from "react";
import * as go from "gojs";

const SequenceDiagram: React.FC = () => {
  const diagramRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null); // Referencia para el panel de herramientas

  useEffect(() => {
    if (!diagramRef.current || !paletteRef.current) return;

    // Crear el diagrama principal
    const $ = go.GraphObject.make;
    const diagram = $(go.Diagram, diagramRef.current, {
      "undoManager.isEnabled": true, // Habilitar deshacer/rehacer
    });

    // Configurar la herramienta de enlace para permitir solo enlaces hacia adelante
    diagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;

    //Para mandar al actor al lienzo
    diagram.nodeTemplateMap.add(
      "actor",
      $(
        go.Node,
        "Vertical", // Disposición vertical: imagen arriba, texto abajo
        { locationSpot: go.Spot.Center, movable: true },
        $(go.Picture, {
          source: "src/assets/actor.png", // Ruta al archivo SVG o imagen
          width: 50,
          height: 50,
        }),
        $(go.TextBlock,
          {
            margin: 5, // Espaciado entre la imagen y el texto
            editable: true, // Permitir editar el texto
            textAlign: "center", // Centrar el texto
          },
          new go.Binding("text", "text").makeTwoWay() // Enlazar el texto con el modelo
        )
      )
    );

    //Mandar los objetos al lienzo
    diagram.nodeTemplateMap.add(
      "object",
      $(
        go.Node,
        "Auto",
        { locationSpot: go.Spot.Center, movable: true },
        $(go.Shape, "Rectangle", { fill: "lightblue", strokeWidth: 0 }), // Objeto como un rectángulo
        $(go.TextBlock, { margin: 8 }, new go.Binding("text", "text").makeTwoWay())
      )
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
    diagram.model = new go.GraphLinksModel([], []); // Modelo vacío
    // Crear el panel de herramientas (palette)
    const palette = $(go.Palette, paletteRef.current, {
      allowDrop: false, // No permitir que se arrastren nodos al palette
    });

    // Plantillas de nodos para el palette
    palette.nodeTemplateMap.add(
      "actor",
      $(
        go.Node,
        "Vertical", // Disposición vertical: imagen arriba, texto abajo
        { locationSpot: go.Spot.Center },
        $(go.Picture, {
          source: "src/assets/actor.png", // Ruta al archivo SVG o imagen
          width: 100, // Ajusta el tamaño según sea necesario
          height: 100,
        }),
        $(go.TextBlock,
          {
            margin: 5, // Espaciado entre la imagen y el texto
            textAlign: "center", // Centrar el texto
          },
          new go.Binding("text", "text") // Enlazar el texto con el modelo
        )
      )
    );

    palette.nodeTemplateMap.add(
      "object",
      $(
        go.Node,
        "Auto",
        { locationSpot: go.Spot.Center },
        $(go.Shape, "Rectangle", { fill: "lightgreen", strokeWidth: 0 }), // Objeto como un rectángulo
        $(go.TextBlock, { margin: 8 }, new go.Binding("text", "text"))
      )
    );

    // Modelo del panel de herramientas con nodos predefinidos
    palette.model = new go.GraphLinksModel([
      { key: "Actor", text: "Actor", category: "actor" }, // Nodo de tipo Actor
      { key: "Objeto", text: "Objeto", category: "object" }, // Nodo de tipo Objeto
    ]);

    // Limpiar el diagrama al desmontar el componente
    return () => {
      diagram.div = null; // Desvincula el diagrama del contenedor
      palette.div = null; // Desvincula el panel de herramientas del contenedor
    };
  }, []);

  return (
    <div style={{ display: "flex" }}>
      {/* Panel de herramientas */}
      <div
        ref={paletteRef}
        style={{
          width: "150px",
          height: "400px",
          border: "1px solid black",
          marginRight: "10px",
          backgroundColor: "gray",
        }}
      />
      {/* Diagrama principal */}
      <div
        ref={diagramRef}
        style={{
          flex: 1,
          height: "400px",
          border: "1px solid black",
          backgroundColor: "white",
        }}
      />
    </div>
  );
};

export default SequenceDiagram;