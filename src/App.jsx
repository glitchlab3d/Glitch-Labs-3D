import React, { useState, useEffect } from 'react';
import { ShoppingCart, Sparkles, Gift, Zap, X, Terminal, Cpu, Upload, Trash2, Plus, Minus, CreditCard, MapPin, CheckCircle, Globe, Monitor, PenTool, Radio, Loader, Image as ImageIcon } from 'lucide-react';

const GlitchStore = () => {
  // --- NAVEGAÇÃO & ESTADO ---
  const [activeTab, setActiveTab] = useState('home'); 
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  
  // --- MULTIVERSO STATE ---
  const [currentUniverse, setCurrentUniverse] = useState('cyberpunk'); 
  const [isTransitioning, setIsTransitioning] = useState(false);

  // --- IA STATE (LAB & CUSTOM) ---
  const apiKey = "AIzaSyAVDgV6NQOnr9klMBV4fTjvS2RoKRkEET8"; // A chave é injetada automaticamente
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  
  // Lab Fusão
  const [item1, setItem1] = useState('');
  const [item2, setItem2] = useState('');
  const [fusionResult, setFusionResult] = useState(null);
  const [fusionImage, setFusionImage] = useState(null);

  // Custom Forge
  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customBlueprint, setCustomBlueprint] = useState(null);

  // --- DADOS FICTÍCIOS ---
  const products = [
    { id: 1, name: "Gato do Exorcista", price: 24, image: "🐱✝️" },
    { id: 2, name: "Vader Florista", price: 30, image: "🌸💀" },
    { id: 3, name: "Shrek Buda", price: 18, image: "🧘‍♂️🟢" },
    { id: 4, name: "Pikachu Maromba", price: 35, image: "💪⚡" },
  ];

  // --- HELPER: GEMINI TEXT API ---
  const callGeminiText = async (prompt, systemInstruction) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: { responseMimeType: "application/json" }
          })
        }
      );
      const data = await response.json();
      return JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text);
    } catch (e) { console.error(e); return null; }
  };

  // --- HELPER: IMAGEN API (GERAR FOTOS) ---
  const callGeminiImage = async (prompt) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: [{ prompt: prompt }],
            parameters: { sampleCount: 1 }
          })
        }
      );
      const data = await response.json();
      return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
    } catch (e) { console.error(e); return null; }
  };

  // --- LÓGICA: FUSÃO (LAB) ---
  const handleFusion = async () => {
    if (!item1 || !item2) return;
    setLoading(true);
    setFusionResult(null);
    setFusionImage(null);
    setStatusMsg("A misturar o DNA no multiverso...");

    // 1. Texto e Prompt para Imagem
    const textPrompt = `
      O usuário quer misturar "${item1}" e "${item2}" num boneco Funko Pop.
      JSON: {
        "nome": "Nome criativo PT",
        "descricao": "Lore engraçada PT (max 2 linhas)",
        "stats": "Poder: 0-100 | Caos: 0-100",
        "img_prompt": "A high quality 3d render of a vinyl toy figure combining ${item1} and ${item2}, studio lighting, solid background, cute, detailed, 4k"
      }
    `;
    const data = await callGeminiText(textPrompt, "Você é uma IA criativa de uma loja cyberpunk.");
    
    if (data) {
      setFusionResult(data);
      setStatusMsg("A imprimir a imagem conceptual...");
      // 2. Imagem
      const img = await callGeminiImage(data.img_prompt);
      setFusionImage(img);
    }
    setLoading(false);
  };

  // --- LÓGICA: CUSTOM (FORGE) ---
  const handleCustom = async () => {
    if (!customDesc) return;
    setLoading(true);
    setCustomBlueprint(null);
    setStatusMsg("A analisar perfil do alvo...");

    const prompt = `
      O usuário quer um boneco customizado.
      Para: ${customName || "Alguém"}
      Descrição: ${customDesc}
      Crie um "Blueprint" (plano de projeto) engraçado.
      JSON: {
        "codename": "Nome de Código do Projeto",
        "acessorios": "Lista de 3 acessórios sugeridos",
        "obs": "Uma observação sarcástica sobre a personalidade descrita"
      }
    `;
    const data = await callGeminiText(prompt, "Você é um engenheiro de brinquedos cyberpunk.");
    setCustomBlueprint(data);
    setLoading(false);
  };

  // --- CONFIGURAÇÃO DOS UNIVERSOS (THEMES) ---
  const universes = {
    cyberpunk: {
      name: "CYBERPUNK",
      bg: "bg-gray-950",
      text: "text-gray-200",
      font: "font-mono",
      accent: "text-cyan-400",
      border: "border-gray-800",
      button: "bg-cyan-600 hover:bg-cyan-500 text-black skew-x-[-10deg]",
      header: "bg-gray-900/95 border-b border-gray-800",
      card: "bg-gray-900 border border-gray-800 hover:border-cyan-500",
      icon: <Cpu />
    },
    paper: {
      name: "PAPER",
      bg: "bg-white",
      text: "text-black",
      font: "font-sans font-bold",
      accent: "text-black",
      border: "border-4 border-black",
      button: "bg-white border-4 border-black text-black hover:bg-black hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-x-0 transition-all",
      header: "bg-white border-b-4 border-black",
      card: "bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all",
      icon: <PenTool />
    },
    retro: {
      name: "VINTAGE",
      bg: "bg-orange-50",
      text: "text-amber-900",
      font: "font-serif",
      accent: "text-orange-600",
      border: "border-amber-200",
      button: "bg-orange-200 text-amber-900 border border-amber-900 hover:bg-orange-300 rounded-full italic",
      header: "bg-orange-100 border-b-2 border-amber-900/20",
      card: "bg-orange-100 border border-amber-900/20 shadow-sm",
      icon: <Radio />
    },
    console: {
      name: "BIOS_98",
      bg: "bg-blue-900",
      text: "text-white",
      font: "font-mono tracking-widest",
      accent: "text-green-400",
      border: "border-white/20",
      button: "bg-gray-300 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-600 text-black active:border-t-gray-600 active:border-l-gray-600",
      header: "bg-blue-800 border-b-2 border-white",
      card: "bg-blue-800 border-2 border-white/50 hover:bg-blue-700",
      icon: <Monitor />
    }
  };

  const theme = universes[currentUniverse];

  // --- MUDAR UNIVERSO ---
  const switchUniverse = () => {
    setIsTransitioning(true);
    const keys = Object.keys(universes);
    const currentIndex = keys.indexOf(currentUniverse);
    const nextIndex = (currentIndex + 1) % keys.length;
    setTimeout(() => {
      setCurrentUniverse(keys[nextIndex]);
      setIsTransitioning(false);
    }, 500); 
  };

  // --- FUNÇÕES DO CARRINHO ---
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  };

  const removeItem = (id) => setCart(prev => prev.filter(item => item.id !== id));
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme.bg} ${theme.text} ${theme.font} selection:bg-pink-500 selection:text-white pb-20 overflow-x-hidden`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Righteous&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;1,900&family=VT323&display=swap');
        .font-display { font-family: 'Righteous', cursive; }
        
        ${currentUniverse === 'paper' ? "body { font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif; }" : ''}
        ${currentUniverse === 'retro' ? ".font-display { font-family: 'Playfair Display', serif; }" : ''}
        ${currentUniverse === 'console' ? ".font-display { font-family: 'VT323', monospace; }" : ''}

        .glitch-gradient {
          background: linear-gradient(270deg, #ec4899, #8b5cf6, #06b6d4, #ec4899);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: gradient-shift 5s ease infinite;
        }
        @keyframes gradient-shift { 0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% } }
        
        .warp-effect {
            animation: warp 0.5s ease-in-out;
        }
        @keyframes warp {
            0% { transform: scale(1) rotate(0deg); opacity: 1; filter: hue-rotate(0deg); }
            50% { transform: scale(0.1) rotate(180deg); opacity: 0; filter: hue-rotate(180deg); }
            100% { transform: scale(1) rotate(360deg); opacity: 1; filter: hue-rotate(0deg); }
        }
      `}</style>

      {/* TELA DE TRANSIÇÃO (LOADING DO MULTIVERSO) */}
      {isTransitioning && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
            <div className="text-center">
                <Sparkles size={64} className="mx-auto text-cyan-400 animate-spin mb-4"/>
                <h2 className="text-2xl font-mono text-white tracking-widest animate-pulse">VIAJANDO NO MULTIVERSO...</h2>
            </div>
        </div>
      )}

      {/* HEADER */}
      <header className={`sticky top-0 z-40 ${theme.header} p-4 transition-all duration-300`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-4">
              <div onClick={() => setActiveTab('home')} className="cursor-pointer group">
                <h1 className={`text-xl md:text-3xl font-display tracking-wider ${currentUniverse === 'cyberpunk' ? 'glitch-gradient' : ''}`}>
                    {currentUniverse === 'paper' ? 'GLITCH_HQ' : 
                     currentUniverse === 'retro' ? 'Glitch & Co.' : 
                     currentUniverse === 'console' ? 'GLITCH.EXE' : 'GLITCH_3D'}
                </h1>
                <p className={`text-[10px] md:text-xs tracking-[0.3em] group-hover:tracking-[0.5em] transition-all font-bold ${theme.accent}`}>
                  IMPRESSÕES DO CAOS
                </p>
              </div>

              {/* BOTÃO MULTIVERSO */}
              <button 
                onClick={switchUniverse}
                className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform ${currentUniverse === 'paper' ? 'bg-black text-white' : 'bg-pink-600 text-white rounded-full'}`}
              >
                <Globe size={12} className="animate-spin-slow"/>
                <span>{theme.name}</span>
              </button>
          </div>

          <nav className="hidden md:flex gap-6 text-xs font-bold tracking-widest items-center">
            {['HOME', 'LAB FUSÃO', 'CUSTOM'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab === 'HOME' ? 'home' : tab === 'LAB FUSÃO' ? 'lab' : 'custom')}
                className={`transition-colors uppercase ${activeTab === (tab === 'HOME' ? 'home' : tab === 'LAB FUSÃO' ? 'lab' : 'custom') ? `${theme.accent} underline decoration-2 underline-offset-4` : 'opacity-60 hover:opacity-100'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
          
          <div className="relative cursor-pointer" onClick={() => setActiveTab('cart')}>
            <ShoppingCart className={`transition-colors ${activeTab === 'cart' ? theme.accent : 'opacity-60 hover:opacity-100'}`} />
            {cart.length > 0 && (
              <span className={`absolute -top-2 -right-2 text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold ${currentUniverse === 'paper' ? 'bg-black text-white' : 'bg-pink-600 text-white'}`}>
                {cart.reduce((a, b) => a + b.qty, 0)}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className={`max-w-6xl mx-auto p-6 ${isTransitioning ? 'opacity-0' : 'opacity-100 warp-effect'}`}>
        
        {/* === HOME PAGE === */}
        {activeTab === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <section className={`${theme.card} p-8 md:p-12 rounded-2xl text-center mb-12 relative overflow-hidden transition-all duration-300`}>
              {currentUniverse === 'cyberpunk' && <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-cyan-900/20"></div>}
              {currentUniverse === 'console' && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30"></div>}
              
              <div className={`mx-auto mb-4 w-16 h-16 ${theme.accent} flex items-center justify-center`}>
                  {theme.icon}
              </div>
              
              <h2 className="text-4xl md:text-5xl font-display mb-4">
                  {currentUniverse === 'retro' ? 'Mercadorias do Futuro' : 
                   currentUniverse === 'paper' ? 'OLHA ESSA BAGUNÇA!' : 
                   'BUGUE A SUA REALIDADE'}
              </h2>
              <p className="opacity-70 max-w-lg mx-auto mb-8">
                  {currentUniverse === 'paper' ? 'Desenhos que ganham vida (literalmente).' : 'Impressões 3D que desafiam a lógica.'}
              </p>
              <button onClick={() => setActiveTab('lab')} className={`py-3 px-8 font-bold transition-all ${theme.button}`}>
                {currentUniverse === 'console' ? '[ PRESS START ]' : 'IR PARA O LAB'}
              </button>
            </section>

            <h3 className="text-xl font-display opacity-60 mb-6 flex items-center gap-2">
                <Terminal size={20}/> 
                {currentUniverse === 'retro' ? 'CATÁLOGO MENSAL' : 'VITRINE DE ERROS'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className={`${theme.card} p-4 transition-all group`}>
                  <div className={`h-40 mb-4 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform ${currentUniverse === 'paper' ? 'grayscale' : 'bg-black/20'}`}>
                    {product.image}
                  </div>
                  <h4 className="font-bold">{product.name}</h4>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`${theme.accent} font-mono`}>{product.price}€</span>
                    <button onClick={() => addToCart(product)} className={`text-xs px-2 py-1 transition-colors ${currentUniverse === 'paper' ? 'bg-black text-white hover:bg-gray-700' : 'bg-gray-800 hover:bg-pink-500 hover:text-white'}`}>
                      + ADD
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === LAB FUSÃO (COM IA & IMAGEM) === */}
        {activeTab === 'lab' && (
          <div className="animate-in fade-in slide-in-from-right-4 max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className={`${theme.accent} border border-current px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block opacity-70`}>
                <Sparkles size={12} className="inline mr-2"/> Powered by Gemini
              </span>
              <h2 className="text-4xl font-display mb-2">LABORATÓRIO DE FUSÃO</h2>
              <p className="opacity-60">Misture dois conceitos. Nós geramos o conceito e a imagem para impressão 3D.</p>
            </div>

            <div className={`${theme.card} p-8 rounded-lg shadow-2xl relative overflow-hidden`}>
              <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
                <div className="w-full relative">
                  <label className={`text-xs ${theme.accent} font-bold ml-2 mb-1 block`}>ELEMENTO A</label>
                  <input 
                    value={item1}
                    onChange={(e) => setItem1(e.target.value)}
                    placeholder="Ex: Batman"
                    className={`w-full bg-black/20 border-2 ${theme.border} text-inherit p-4 rounded-lg outline-none font-bold text-center`}
                  />
                </div>
                <div className="text-2xl font-display">+</div>
                <div className="w-full relative">
                  <label className={`text-xs ${theme.accent} font-bold ml-2 mb-1 block`}>ELEMENTO B</label>
                  <input 
                    value={item2}
                    onChange={(e) => setItem2(e.target.value)}
                    placeholder="Ex: Torradeira"
                    className={`w-full bg-black/20 border-2 ${theme.border} text-inherit p-4 rounded-lg outline-none font-bold text-center`}
                  />
                </div>
              </div>

              <button 
                onClick={handleFusion}
                disabled={loading || !item1 || !item2}
                className={`w-full py-4 text-xl font-display flex justify-center items-center gap-3 transition-all ${theme.button} disabled:opacity-50`}
              >
                {loading ? <Loader className="animate-spin"/> : <Zap fill="currentColor"/>}
                {loading ? statusMsg : "INICIAR PROCESSO DE FUSÃO"}
              </button>

              {/* RESULTADOS IA */}
              {fusionResult && !loading && (
                <div className={`mt-8 border-t ${theme.border} pt-8 animate-in slide-in-from-bottom-10`}>
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* IMAGEM GERADA */}
                    <div className={`w-full md:w-1/2 aspect-square bg-black/10 rounded-lg flex items-center justify-center border ${theme.border} overflow-hidden relative group`}>
                      {fusionImage ? (
                        <>
                          <img src={fusionImage} alt="Gerado por IA" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">
                            IA PREVIEW
                          </div>
                        </>
                      ) : (
                        <div className="opacity-50 animate-pulse text-sm">Gerando visual...</div>
                      )}
                    </div>

                    {/* TEXTO */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                      <h3 className={`text-3xl font-display mb-2 ${theme.accent}`}>
                        {fusionResult.nome}
                      </h3>
                      <div className="flex gap-2 mb-4 text-xs font-mono">
                         <span className="bg-black/20 px-2 py-1 rounded opacity-70">{fusionResult.stats}</span>
                      </div>
                      <p className="italic opacity-80 mb-6 border-l-2 pl-4 border-current">
                        "{fusionResult.descricao}"
                      </p>
                      <button 
                        onClick={() => {
                            addToCart({ id: Date.now(), name: fusionResult.nome, price: 45, image: "✨" });
                            setActiveTab('cart');
                        }}
                        className={`py-3 border border-current hover:opacity-50 transition-colors uppercase font-bold text-xs`}
                      >
                        ENCOMENDAR ESTE PRODUTO (45€)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* === CUSTOM FORGE (COM IA DE TEXTO) === */}
        {activeTab === 'custom' && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-500 max-w-3xl mx-auto">
             <div className="text-center mb-10">
              <span className={`${theme.accent} mb-2 block`}><Gift className="inline mb-1" size={20}/> ÁREA DE PRESENTES</span>
              <h2 className="text-4xl font-display mb-2">CUSTOM FORGE</h2>
              <p className="opacity-60">Quer transformar seu namorado num Jedi ou sua mãe numa Super-Heroína? Descreva aqui.</p>
            </div>

            <div className={`${theme.card} p-8 shadow-2xl`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold opacity-50 mb-2">QUEM É O ALVO?</label>
                  <input 
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    placeholder="Ex: Meu namorado João" 
                    className={`w-full bg-black/20 border ${theme.border} p-3 rounded text-inherit outline-none`}
                  />
                </div>
                <div>
                   <label className="block text-sm font-bold opacity-50 mb-2">FOTOS DE REFERÊNCIA</label>
                   <div className={`border-2 border-dashed ${theme.border} hover:opacity-100 opacity-50 rounded p-2 flex items-center justify-center gap-2 cursor-pointer h-[50px]`}>
                      <Upload size={16}/> <span className="text-xs">UPLOAD (JPG/PNG)</span>
                   </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold opacity-50 mb-2">DESCRIÇÃO DETALHADA</label>
                <textarea 
                  value={customDesc}
                  onChange={e => setCustomDesc(e.target.value)}
                  placeholder="Ele ama pizza, toca guitarra e sempre usa boné virado pra trás..."
                  className={`w-full h-32 bg-black/20 border ${theme.border} p-3 rounded text-inherit outline-none resize-none`}
                ></textarea>
              </div>

              <button 
                onClick={handleCustom}
                disabled={loading || !customDesc}
                className={`w-full py-3 font-bold transition-colors flex justify-center items-center gap-2 ${theme.button}`}
              >
                {loading ? <Loader className="animate-spin"/> : <Terminal size={18}/>}
                {loading ? statusMsg : "GERAR BLUEPRINT"}
              </button>

              {/* RESPOSTA IA CUSTOM */}
              {customBlueprint && !loading && (
                <div className="mt-8 bg-black/10 p-6 rounded border border-current font-mono text-sm relative">
                  <div className={`absolute -top-3 left-4 ${theme.bg} border border-current px-2 py-0.5 text-xs font-bold rounded`}>BLUEPRINT GERADO</div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="opacity-50 block text-xs mb-1">CODENAME</span>
                      <strong className={`${theme.accent} text-lg`}>{customBlueprint.codename}</strong>
                    </div>
                    <div>
                      <span className="opacity-50 block text-xs mb-1">ACESSÓRIOS</span>
                      <ul className="list-disc list-inside opacity-80">
                        {Array.isArray(customBlueprint.acessorios) 
                          ? customBlueprint.acessorios.map(a => <li key={a}>{a}</li>) 
                          : <li>{customBlueprint.acessorios}</li>
                        }
                      </ul>
                    </div>
                  </div>
                  
                  <div className={`mt-4 pt-4 border-t ${theme.border}`}>
                    <span className="opacity-50 block text-xs mb-1">NOTAS DO ENGENHEIRO</span>
                    <p className="italic opacity-80">"{customBlueprint.obs}"</p>
                  </div>

                  <button className="w-full mt-4 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black py-2 text-xs font-bold uppercase transition-colors">
                    APROVAR PROJETO
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* === CARRINHO === */}
        {activeTab === 'cart' && (
          <div className="animate-in fade-in slide-in-from-right-4 max-w-4xl mx-auto">
            <h2 className={`text-3xl font-display mb-8 pb-4 border-b ${theme.border}`}>SEU INVENTÁRIO</h2>
            
            {cart.length === 0 ? (
              <div className="text-center py-20 opacity-50">
                <ShoppingCart size={48} className="mx-auto mb-4"/>
                <p>O SEU CARRINHO ESTÁ VAZIO.</p>
                <button onClick={() => setActiveTab('home')} className={`mt-4 ${theme.accent} underline`}>VOLTAR À BASE</button>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className={`${theme.card} p-4 flex items-center gap-4 relative`}>
                      <div className={`w-16 h-16 flex items-center justify-center text-2xl ${currentUniverse === 'paper' ? 'border-2 border-black' : 'bg-black/30'}`}>
                        {item.image}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold">{item.name}</h4>
                        <p className={`${theme.accent} text-sm`}>{item.price}€</p>
                      </div>
                      <div className={`flex items-center gap-3 p-1 ${currentUniverse === 'paper' ? 'border-2 border-black' : 'bg-black/20'}`}>
                        <button onClick={() => updateQty(item.id, -1)} className="p-1"><Minus size={14}/></button>
                        <span className="font-mono text-sm w-4 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="p-1"><Plus size={14}/></button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="opacity-50 hover:opacity-100 ml-2"><Trash2 size={18}/></button>
                    </div>
                  ))}
                </div>

                <div className="lg:w-80">
                  <div className={`${theme.card} p-6 sticky top-24`}>
                    <h3 className="font-display text-xl mb-4">RESUMO</h3>
                    <div className={`space-y-2 text-sm opacity-70 mb-6 border-b pb-4 ${theme.border}`}>
                      <div className="flex justify-between"><span>Subtotal</span><span>{cartTotal}€</span></div>
                      <div className="flex justify-between"><span>Envio</span><span>3.50€</span></div>
                    </div>
                    <div className="flex justify-between text-xl font-bold mb-6">
                      <span>TOTAL</span>
                      <span className={theme.accent}>{(cartTotal + 3.50).toFixed(2)}€</span>
                    </div>
                    <button onClick={() => setIsCheckoutOpen(true)} className={`w-full py-3 font-bold transition-all ${theme.button}`}>
                      FINALIZAR
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* === CHECKOUT MODAL === */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`${theme.bg} ${theme.text} ${theme.border} border-2 w-full max-w-lg shadow-2xl relative`}>
            
            <div className={`p-4 border-b ${theme.border} flex justify-between items-center`}>
              <h3 className={`font-display ${theme.accent}`}>CHECKOUT</h3>
              <button onClick={() => setIsCheckoutOpen(false)}><X/></button>
            </div>

            <div className="p-8">
              {checkoutStep === 1 && (
                <div className="animate-in slide-in-from-right">
                  <h4 className="font-bold mb-4 flex items-center gap-2"><MapPin size={18}/> ONDE ENTREGAMOS?</h4>
                  <div className="space-y-3 mb-6">
                    <input placeholder="Nome Completo" className={`w-full bg-black/20 border ${theme.border} p-3 outline-none`}/>
                    <input placeholder="Morada (Rua, Nº, Andar)" className={`w-full bg-black/20 border ${theme.border} p-3 outline-none`}/>
                    <div className="flex gap-3">
                        <input placeholder="Código Postal" className={`w-1/3 bg-black/20 border ${theme.border} p-3 outline-none`}/>
                        <input placeholder="Cidade" defaultValue="Lisboa" className={`w-2/3 bg-black/20 border ${theme.border} p-3 outline-none`}/>
                    </div>
                  </div>
                  <button onClick={() => setCheckoutStep(2)} className={`w-full py-3 font-bold ${theme.button}`}>
                    SEGUINTE: PAGAMENTO
                  </button>
                </div>
              )}

              {checkoutStep === 2 && (
                <div className="animate-in slide-in-from-right">
                   <h4 className="font-bold mb-4 flex items-center gap-2"><CreditCard size={18}/> COMO QUERES PAGAR?</h4>
                   <div className="space-y-3 mb-6">
                     <label className={`flex items-center gap-3 p-4 border ${theme.border} cursor-pointer hover:opacity-80`}>
                        <div className="w-4 h-4 rounded-full bg-red-500"></div>
                        <span className="font-bold">MB WAY</span>
                        <span className="ml-auto text-xs bg-red-600 text-white px-2 py-1 rounded">PT</span>
                     </label>
                     <label className={`flex items-center gap-3 p-4 border ${theme.border} cursor-pointer opacity-60`}>
                        <div className="w-4 h-4 rounded-full border border-current"></div>
                        <span>Cartão de Crédito</span>
                     </label>
                   </div>
                   <div className="flex gap-3">
                     <button onClick={() => setCheckoutStep(1)} className="w-1/3 border border-current opacity-50 hover:opacity-100">VOLTAR</button>
                     <button onClick={() => setCheckoutStep(3)} className={`w-2/3 py-3 font-bold ${theme.button}`}>
                        PAGAR {(cartTotal + 3.50).toFixed(2)}€
                     </button>
                   </div>
                </div>
              )}

              {checkoutStep === 3 && (
                <div className="text-center py-8 animate-in zoom-in">
                   <CheckCircle size={64} className="mx-auto text-green-500 mb-4"/>
                   <h4 className="text-2xl font-display mb-2">PAGAMENTO ACEITE!</h4>
                   <p className="opacity-70 mb-6">A encomenda #84920 foi enviada para a fila de impressão.</p>
                   <button onClick={() => {setIsCheckoutOpen(false); setCheckoutStep(1); setCart([]); setActiveTab('home')}} className={`px-6 py-2 border border-current hover:bg-white hover:text-black transition-colors`}>
                     FECHAR
                   </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GlitchStore;
