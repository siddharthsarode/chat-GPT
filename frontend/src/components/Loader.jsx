const Loader = () => {
  return (
    <div className="flex flex-col w-full items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-5xl font-extrabold bg-gradient-to-r from-white via-gray-500 to-gray-600 bg-clip-text text-transparent mb-2">
        ChatGPT Clone
      </h1>
      <div className="flex items-center space-x-2 mt-6">
        <div
          className="w-4 h-4 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="w-4 h-4 rounded-full bg-gray-500 animate-bounce"
          style={{ animationDelay: "0.2s" }}
        />
        <div
          className="w-4 h-4 rounded-full bg-gray-600 animate-bounce"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
      <p className="mt-4 text-gray-400 text-lg font-medium">Loading...</p>
    </div>
  );
};

export default Loader;
