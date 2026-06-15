import React from 'react';

// Create a helper that maps motion components back to normal HTML tags
const createMotionComponent = (TagName) => {
 return React.forwardRef(({
 animate, initial, exit, transition, whileHover, whileTap, drag, dragConstraints, dragElastic, dragTransition, onDragEnd, layout, variants,
 ...props
 }, ref) => {
 return <TagName ref={ref} {...props} />;
 });
};

// Return a proxy that intercepts property accesses (like motion.div) and yields a normal React component
export const motion = new Proxy({}, {
 get: (target, prop) => {
 // If the prop is lowercase, it represents an HTML tag
 if (typeof prop === 'string' && prop[0] === prop[0].toLowerCase()) {
 return createMotionComponent(prop);
 }
 return undefined;
 }
});

// Mock AnimatePresence to simply render its children
export const AnimatePresence = ({ children }) => <>{children}</>;
