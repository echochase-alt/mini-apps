import { useEffect, useState } from "react";

export const Bubbles = ({ colour }) => {
  const bubbleCount = 50;
  const minSize = 10;
  const maxSize = 450;
  const spacingBuffer = 10;

  const [bubbles, setBubbles] = useState([]);

  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  function isOverlapping(newBubble, bubbles) {
    for (let bubble of bubbles) {
      let dx = newBubble.x - bubble.x;
      let dy = newBubble.y - bubble.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < newBubble.size / 2 + bubble.size / 2 + spacingBuffer) {
        return true;
      }
    }
    return false;
  }

  const generateBubbles = () => {
    const containerWidth = document.documentElement.offsetWidth;
    const containerHeight = document.body.offsetHeight;

    const generatedBubbles = [];

    while (generatedBubbles.length < bubbleCount) {
      const size = getRandom(minSize, maxSize);
      const x = getRandom(size / 2, containerWidth - size / 2);
      const y = getRandom(size / 2, containerHeight - size / 2);

      const newBubble = { x, y, size };

      if (!isOverlapping(newBubble, generatedBubbles)) {
        generatedBubbles.push(newBubble);
      }
    }

    setBubbles(generatedBubbles);
  };

  useEffect(() => {
    generateBubbles();
    
    const resizeObserver = new ResizeObserver(() => {
      generateBubbles();
    });

    resizeObserver.observe(document.body);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <>
      {bubbles.map((bubble, index) => (
        <div
          key={index}
          className="background-bubble"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.x - bubble.size / 2}px`,
            top: `${bubble.y - bubble.size / 2}px`,
            background: colour,
            position: "absolute",
          }}
        />
      ))}
    </>
  );
};
