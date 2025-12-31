function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center">
          <h1 className="text-header text-2xl font-bold">Tradutor</h1>
        </div>
      </header>

      <main className="grow bg-background flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-md overflow-hidden">
          <div></div>
        </div>
      </main>
    </div>
  );
}

export default App;
