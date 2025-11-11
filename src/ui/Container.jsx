import React from "react";

// Kiçik utility funksiyası: class-ları birləşdirmək üçün
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Container = ({ children, className }) => {
  return (
    <div className={cn("max-w-screen-xl mx-auto", className)}>
      {children}
    </div>
  );
};

export default Container;
