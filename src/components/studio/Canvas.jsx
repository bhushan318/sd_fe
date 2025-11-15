const Canvas = () => {
  return (
    <div className="w-full h-full bg-zinc-50 relative overflow-hidden">
      {/* Optional subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 19px, #e4e4e7 19px, #e4e4e7 20px),
            repeating-linear-gradient(90deg, transparent, transparent 19px, #e4e4e7 19px, #e4e4e7 20px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Canvas Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 text-sm">
            Your canvas content goes here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
