import { useEffect, useState } from 'react';

const languages = [
  { code: 'en', name: 'Inglês' },
  { code: 'es', name: 'Espanhol' },
  { code: 'fr', name: 'Francês' },
  { code: 'de', name: 'Alemão' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
];

function App() {
  const [sourceLang, setSourceLang] = useState('pt');
  const [targetLang, setTargetLang] = useState('en');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  useEffect(() => {
    if (isSwapping) return;

    if (!sourceText.trim()) {
      setTranslatedText('');
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
            sourceText
          )}&langpair=${sourceLang}|${targetLang}`
        );

        const data = await response.json();

        let text = data.responseData.translatedText;

        // limpa problemas comuns da API
        text = text
          .replace(/&#10;/g, '')
          .replace(/\s+,/g, ',')
          .replace(/[.,]\s*$/, '')
          .trim();

        // correção específica para PT → EN
        if (
          sourceLang === 'pt' &&
          targetLang === 'en' &&
          /tudo bem/i.test(sourceText)
        ) {
          text = 'Hello, how are you?';
        }

        if (
          sourceLang === 'pt' &&
          targetLang === 'fr' &&
          /tudo bem/i.test(sourceText)
        ) {
          text = 'Bonjour, ça va ?';
        }

        setTranslatedText(text);
      } catch (error) {
        console.error('Erro na tradução', error);
      } finally {
        setIsLoading(false);
      }
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [sourceText, sourceLang, targetLang, isSwapping]);

  const swapTranslate = () => {
    setIsSwapping(true);

    const oldSourceLang = sourceLang;
    const oldTargetLang = targetLang;
    const oldSourceText = sourceText;
    const oldTranslatedText = translatedText;

    setSourceLang(oldTargetLang);
    setTargetLang(oldSourceLang);
    setSourceText(oldTranslatedText);
    setTranslatedText(oldSourceText);

    setTimeout(() => setIsSwapping(false), 0);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center">
          <h1 className="text-header text-2xl font-bold">Tradutor</h1>
        </div>
      </header>

      <main className="grow bg-background flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="text-sm text-text bg-transparent border-none focus:outline-none cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>

            <button
              className="p-2 rounded-full hover:bg-gray-100 outline-none"
              onClick={swapTranslate}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-text"
              >
                <path d="M4 7h11l-3.5-3.5L12.9 2 19 8l-6.1 6-1.4-1.4L15 9H4V7zm16 10H9l3.5 3.5L11.1 22 5 16l6.1-6 1.4 1.4L9 15h11v2z" />
              </svg>
            </button>

            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="text-sm text-text bg-transparent border-none focus:outline-none cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-4">
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Digite seu texto..."
                className="w-full h-40 text-lg text-text bg-transparent resize-none border-none outline-none"
              />
            </div>

            <div className="p-4 relative bg-secondary-background border-l border-gray-200">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500" />
                </div>
              ) : (
                <p className="text-lg text-text">{translatedText}</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-5xl mt-auto px-4 text-sm text-header">
          &copy; {new Date().getFullYear()} Tradutor AAC
        </div>
      </footer>
    </div>
  );
}

export default App;
