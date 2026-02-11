interface HeroBannerProps {
  title?: string;
  subtitle?: string;
}

export default function HeroBanner({ title, subtitle }: HeroBannerProps) {
  const displayTitle = title || 'Temukan lowongan yang\ncocok untuk kamu';
  const lines = displayTitle.split('\n');
  const lastLineIndex = lines.length - 1;

  return (
    <div className="bg-slate-800 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <p className="text-blue-400 text-sm font-medium mb-2">Dicoding Jobs</p>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            {lines.map((line, index) => (
              <span key={index}>
                {index === lastLineIndex ? (
                  <span className="inline-flex items-center gap-3">
                    {line}
                    <span className="hidden md:inline-block w-52 h-14 rounded-full overflow-hidden align-middle">
                      <img
                        src="/dicoding-at-work.jpg"
                        alt="Person working"
                        className="w-full h-full object-cover object-[center_20%]"
                      />
                    </span>
                  </span>
                ) : (
                  <>
                    {line}
                    <br />
                  </>
                )}
              </span>
            ))}
          </h1>
        </div>
        {subtitle && (
          <p className="text-gray-300 mt-2 text-sm whitespace-pre-line">{subtitle}</p>
        )}
      </div>
    </div>
  );
}