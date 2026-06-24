interface ReadingProgressProps {
  progress: number;
}

const ReadingProgress = ({ progress }: ReadingProgressProps) => {
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1 bg-white/10">
      <div
        className="h-full bg-[#7C61FF] transition-all duration-200 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
};

export default ReadingProgress;
