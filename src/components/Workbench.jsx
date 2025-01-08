import "./Workbench.css";
import { useState, useRef } from "react";

const WorkbenchApp = () => {
  const [objects, setObjects] = useState([]);
  const [connections, setConnections] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const workbenchRef = useRef(null);

  const tools = [
    { id: "turbine", name: "Turbine", color: "#FF9800" },
    { id: "battery", name: "Battery", color: "#4CAF50" },
    { id: "storage", name: "Storage", color: "#2196F3" },
  ];

  const handleDragStart = (e, tool) => {
    setDraggedItem(tool);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedItem) {
      const workbenchRect = workbenchRef.current.getBoundingClientRect();
      const x = Math.min(Math.max(52.4, e.clientX - workbenchRect.left), 964.4);
      const y = Math.min(Math.max(32, e.clientY - workbenchRect.top), 589);

      setObjects([
        ...objects,
        {
          ...draggedItem,
          id: `${draggedItem.id}-${Date.now()}`,
          x,
          y,
        },
      ]);
      setDraggedItem(null);
    }
  };

  const handleConnection = (e, object) => {
    e.stopPropagation();
    if (!connectingFrom) {
      setConnectingFrom(object);
    } else {
      if (connectingFrom.id !== object.id) {
        setConnections([
          ...connections,
          {
            from: connectingFrom.id,
            to: object.id,
          },
        ]);
      }
      setConnectingFrom(null);
    }
  };

  const moveObject = (e, objectId) => {
    const workbenchRect = workbenchRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(52.4, e.clientX - workbenchRect.left), 964.4);
    const y = Math.min(Math.max(32, e.clientY - workbenchRect.top), 695);

    setObjects(
      objects.map((obj) => (obj.id === objectId ? { ...obj, x, y } : obj))
    );
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 3000);
  };

  const handleDelete = (id) => {
    setObjects(objects.filter((obj) => obj.id != id));
  };

  return (
    <div className="workbench-container">
      <div className="toolbox">
        <h3 className="tools-heading">Tools</h3>
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="tool"
            draggable
            onDragStart={(e) => handleDragStart(e, tool)}
            style={{ backgroundColor: tool.color }}
          >
            {tool.name}
          </div>
        ))}
      </div>

      <div
        ref={workbenchRef}
        className="workbench"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => setConnectingFrom(null)}
      >
        {connections.map((connection, index) => {
          const fromObj = objects.find((obj) => obj.id === connection.from);
          const toObj = objects.find((obj) => obj.id === connection.to);
          if (!fromObj || !toObj) return null;

          return (
            <svg key={index} className="connection-line">
              <line
                x1={fromObj.x}
                y1={fromObj.y}
                x2={toObj.x}
                y2={toObj.y}
                stroke="#666"
                strokeWidth="2"
                strokeDasharray="5 5"
              />
            </svg>
          );
        })}

        {objects.map((object) => (
          <div
            key={object.id}
            className={`object ${
              connectingFrom?.id == object.id ? "connection-progress" : null
            }`}
            style={{
              left: object.x,
              top: object.y,
              backgroundColor: object.color,
            }}
            draggable
            onClick={(e) => handleConnection(e, object)}
            onDrag={(e) => moveObject(e, object.id)}
          >
            {object.name}
            {connectingFrom?.id == object.id && (
              <div
                onClick={() => handleDelete(object.id)}
                className="delte-object"
              >
                ×
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="controls">
        <button
          className={`simulate-button ${isSimulating ? "simulating" : ""}`}
          onClick={handleSimulate}
          disabled={isSimulating}
        >
          {isSimulating ? "Simulating..." : "Simulate"}
        </button>
      </div>
    </div>
  );
};

export default WorkbenchApp;
