import React, { useState, useEffect } from 'react';
import { ShoppingCart, Sparkles, Gift, Zap, X, Terminal, Cpu, Upload, Trash2, Plus, Minus, CreditCard, MapPin, CheckCircle, Globe, Monitor, PenTool, Radio, Loader, Image as ImageIcon, Gamepad2, Disc, User, LogOut, Package, MessageCircle, Box } from 'lucide-react';

const GlitchStore = () => {
  // --- CONFIGURAÇÕES ---
  const whatsappNumber = "351962606024"; // O teu número
  
  // 
  const apiKey = "AIzaSyAVDgV6NQOnr9klMBV4fTjvS2RoKRkEET8"; 

  // --- NAVEGAÇÃO & ESTADO ---
  const [activeTab, setActiveTab] = useState('home'); 
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [language, setLanguage] = useState('PT');
  
  const [addressData, setAddressData] = useState({ name: '', address: '', zip: '', city: 'Lisboa' });

  // --- MULTIVERSO STATE ---
  const [currentUniverse, setCurrentUniverse] = useState('cyberpunk'); 
  const [isTransitioning, setIsTransitioning] = useState(false);

  // --- IA STATE ---
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  
  const [item1, setItem1] = useState('');
  const [item2, setItem2] = useState('');
  const [fusionResult, setFusionResult] = useState(null);
  const [fusionImage, setFusionImage] = useState(null);

  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customBlueprint, setCustomBlueprint] = useState(null);

  // --- DADOS DA LOJA (ITENS NORMAIS) ---
  const products = [
    { id: 1, name: "Chaveiro Pixel Sword", price: 5.50, category: "Acessórios", image: "🗡️" },
    { id: 2, name: "Busto Batman (15cm)", price: 25.00, category: "Colecionáveis", image: "🦇" },
    { id: 3, name: "Suporte Headset", price: 18.00, category: "Setup", image: "🎧" },
    { id: 4, name: "Vaso Geométrico", price: 12.00, category: "Decoração", image: "🪴" },
    { id: 5, name: "Pokeball Deck Box", price: 20.00, category: "Games", image: "🔴" },
    { id: 6, name: "Baby Yoda (Pintado)", price: 35.00, category: "Figuras", image: "👽" },
    { id: 7, name: "Porta-Chaves Spotify", price: 8.00, category: "Personalizado", image: "🎵" },
    { id: 8, name: "Mount de Parede PS5", price: 15.00, category: "Setup", image: "🎮" },
  ];

  // --- MOCK DADOS CLIENTE ---
  const clientData = {
    name: "Viajante do Tempo",
    email: "cliente@glitch.pt",
    orders: [
      { id: "#84920", date: "2023-10-15", status: "Entregue", total: "25.00€" },
      { id: "#84102", date: "2023-09-01", status: "Em Trânsito", total: "12.00€" }
    ]
  };

  // --- WHATSAPP LOGIC ---
  const sendToWhatsApp = () => {
    let orderText = cart.map(item => `- ${item.qty}x ${item.name} (${item.price}€)`).join('%0a');
    const total = (cart.reduce((acc, item) => acc + (item.price * item.qty), 0) + 3.50).toFixed(2);
    const message = `Olá GLITCH LISBON! 👾%0aGostaria de encomendar:%0a%0a${orderText}%0a%0a📦 *Envio:* 3.50€%0a💰 *TOTAL:* ${total}€%0a%0a📍 *Dados de Envio:*%0aNome: ${addressData.name}%0aMorada: ${addressData.address}%0aCP: ${addressData.zip} ${addressData.city}%0a%0aAguardo dados para MB WAY!`;
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    setCheckoutStep(3);
  };

  // --- API HELPERS (CORRIGIDO PARA GEMINI PRO) ---
  const callGeminiText = async (prompt, systemInstruction) => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: systemInstruction }] }, generationConfig: { responseMimeType: "application/json" } })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Erro IA Texto (${response.status}): ${errorData.error?.message || 'Erro desconhecido'}`);
        throw new Error(errorData.error?.message);
      }
      
      const data = await response.json();
      return JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text);
    } catch (e) { console.error(e); setStatusMsg("Erro IA (Texto)."); return null; }
  };

  const callGeminiImage = async (prompt) => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instances: [{ prompt: prompt }], parameters: { sampleCount: 1 } })
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Erro IA Imagem (${response.status}): ${errorData.error?.message || 'Erro desconhecido'}`);
        throw new Error(errorData.error?.message);
      }

      const data = await response.json();
      return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
    } catch (e) { console.error(e); setStatusMsg("Erro IA (Imagem)."); return null; }
  };

  // --- HANDLERS ---
  const handleFusion = async () => {
    if (!item1 || !item2) return;
    setLoading(true); setFusionResult(null); setFusionImage(null);
    setStatusMsg(language === 'PT' ? "A misturar DNA..." : "Mixing DNA...");
    const textData = await callGeminiText(`Mistura "${item1}" e "${item2}" num boneco Funko. JSON: { "nome": "PT", "descricao": "PT", "stats": "Poder/Caos", "img_prompt": "3d render vinyl toy ${item1} ${item2} cute white background studio" }`, "Criativo Loja");
    if (textData) {
      setFusionResult(textData);
      setStatusMsg(language === 'PT' ? "Gerando visual..." : "Generating visuals...");
      const img = await callGeminiImage(textData.img_prompt);
      setFusionImage(img);
    }
    setLoading(false);
  };

  const handleCustom = async () => {
    if (!customDesc) return;
    setLoading(true); setCustomBlueprint(null);
    setStatusMsg(language === 'PT' ? "A processar pedido..." : "Processing request...");
    const data = await callGeminiText(`Boneco custom para: ${customName}. Desc: ${customDesc}. JSON: { "codename": "...", "acessorios": ["..."], "obs": "..." }`, "Engenheiro Toy");
    setCustomBlueprint(data);
    setLoading(false);
  };

  // --- UNIVERSOS ---
  const universes = {
    cyberpunk: {
      name: "UNIVERSE 2079",
      bgClass: "bg-gray-950",
      bgImage: "none", 
      overlay: null,
      text: "text-gray-200",
      font: "font-mono",
      accent: "text-cyan-400",
      border: "border-gray-800",
      button: "bg-cyan-600 hover:bg-cyan-500 text-black skew-x-[-10deg]",
      header: "bg-gray-900/90 border-b border-gray-800 backdrop-blur-md",
      card: "bg-gray-900/80 border border-gray-800 hover:border-cyan-500 backdrop-blur",
      icon: <Cpu />
    },
    paper: {
      name: "COMIC BOOK UNIVERSE",
      bgClass: "bg-white",
      bgImage: "url('https://www.transparenttextures.com/patterns/notebook.png')",
      overlay: null,
      text: "text-black",
      font: "font-sans font-bold",
      accent: "text-black",
      border: "border-4 border-black",
      button: "bg-white border-4 border-black text-black hover:bg-black hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
      header: "bg-white border-b-4 border-black",
      card: "bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1",
      icon: <PenTool />
    },
    retro: {
      name: "VINTAGE 60s UNIVERSE",
      bgClass: "bg-red-600",
      bgImage: "url('/vintage60swallpaper.png')", 
      overlay: null,
      text: "text-white",
      font: "font-['Righteous'] tracking-wide", 
      accent: "text-yellow-300",
      border: "border-white",
      button: "bg-white text-red-600 rounded-full hover:bg-yellow-300 hover:text-red-700 shadow-lg border-2 border-white transform hover:scale-105 transition-transform",
      header: "bg-red-700/90 border-b-4 border-white shadow-md backdrop-blur",
      card: "bg-red-600/90 border-4 border-white rounded-xl shadow-xl hover:rotate-1 transition-transform",
      icon: <Disc />
    },
    console: {
      name: "ARCADE UNIVERSE",
      bgClass: "bg-black",
      bgImage: "url('/pacman.jpg')", 
      overlay: null,
      text: "text-yellow-400",
      font: "font-['Press_Start_2P'] leading-relaxed text-[10px] md:text-xs",
      accent: "text-pink-500",
      border: "border-blue-700",
      button: "bg-blue-900 border-b-4 border-blue-600 text-yellow-300 hover:bg-blue-800 active:border-b-0 active:translate-y-1",
      header: "bg-black/90 border-b-4 border-blue-800 backdrop-blur",
      card: "bg-black/80 border-2 border-blue-500 hover:border-pink-500 hover:shadow-[0_0_15px_rgba(236,72,153,0.7)]",
      icon: <Gamepad2 />
    }
  };

  const theme = universes[currentUniverse];

  const addToCart = (product) => setCart(prev => {
    const ex = prev.find(p => p.id === product.id);
    return ex ? prev.map(p => p.id === product.id ? {...p, qty: p.qty+1} : p) : [...prev, {...product, qty: 1}];
  });
  const updateQty = (id, d) => setCart(prev => prev.map(p => p.id === id ? {...p, qty: Math.max(1, p.qty+d)} : p));
  const removeItem = (id) => setCart(prev => prev.filter(p => p.id !== id));
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const switchUniverse = () => {
    setIsTransitioning(true);
    const keys = Object.keys(universes);
    const next = keys[(keys.indexOf(currentUniverse) + 1) % keys.length];
    setTimeout(() => { setCurrentUniverse(next); setIsTransitioning(false); }, 500);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${theme.bgClass} ${theme.text} ${theme.font} selection:bg-pink-500 selection:text-white pb-20 overflow-x-hidden relative`}>
      <div className="fixed inset-0 z-0 pointer-events-none transition-all duration-500" style={{ backgroundImage: theme.bgImage, backgroundSize: currentUniverse === 'paper' ? 'auto' : 'cover', backgroundPosition: 'center', backgroundRepeat: currentUniverse === 'paper' ? 'repeat' : 'no-repeat' }} />
      {theme.overlay && <div className="fixed inset-0 z-0 pointer-events-none transition-all duration-500" style={{ backgroundColor: theme.overlay }} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Righteous&family=Press+Start+2P&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
        .font-display { font-family: 'Righteous', cursive; }
        ${currentUniverse === 'paper' ? "body { font-family: 'Comic Sans MS', sans-serif; }" : ''}
        ${currentUniverse === 'retro' ? ".font-display { font-family: 'Righteous', cursive; }" : ''}
        ${currentUniverse === 'console' ? ".font-display { font-family: 'Press Start 2P', cursive; font-size: 16px !important; letter-spacing: -1px; }" : ''}
        .glitch-gradient {
          background: linear-gradient(90deg, #ec4899, #8b5cf6, #06b6d4, #ec4899);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: colorFlow 3s linear infinite;
        }
        
        @keyframes colorFlow { 
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        } gradient-shift { 0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% } }
        .warp-effect { animation: slideDownFade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes slideDownFade { 0% { opacity: 0; transform: translateY(-40px); } 100% { opacity: 1; transform: translateY(0); } }
      `}</style>

      {isTransitioning && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
            <div className="text-center">
                <Sparkles size={64} className="mx-auto text-cyan-400 animate-spin mb-4"/>
                <h2 className="text-2xl font-mono text-white tracking-widest animate-pulse"> A CARREGAR DIMENSÃO...</h2>
            </div>
        </div>
      )}

      <div className="relative z-10">
        <header className={`sticky top-0 z-40 ${theme.header} p-4 shadow-lg`}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto justify-start">
                <div onClick={() => setActiveTab('home')} className="cursor-pointer group">
                  {/* AQUI ESTÁ A ALTERAÇÃO: glitch-gradient EM TODOS OS UNIVERSOS */}
                  <h1 className="text-xl md:text-3xl font-display tracking-wider glitch-gradient">GLITCH LISBON</h1>
                  <p className={`text-[10px] md:text-xs tracking-[0.3em] font-bold ${theme.accent}`}>STORE & LABS</p>
                </div>
                <button onClick={switchUniverse} className={`flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase rounded-full ${currentUniverse === 'paper' ? 'bg-black text-white' : 'bg-pink-600 text-white'}`}>
                  <Globe size={12} className="animate-spin-slow"/> <span>{theme.name}</span>
                </button>
            </div>

            <nav className="flex gap-4 md:gap-8 text-xs font-bold tracking-widest items-center overflow-x-auto w-full md:w-auto justify-center">
              {[
                { id: 'home', label: language === 'PT' ? 'LOJA' : 'STORE' },
                { id: 'lab', label: language === 'PT' ? 'LABS (IA)' : 'LABS (AI)' },
                { id: 'custom', label: language === 'PT' ? 'FORGE (CUSTOM)' : 'FORGE' },
                { id: 'cart', label: language === 'PT' ? 'CHECKOUT' : 'CHECKOUT' }
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`transition-colors uppercase whitespace-nowrap px-2 py-1 ${activeTab === tab.id ? `${theme.accent} border-b-2 border-current` : 'opacity-60 hover:opacity-100'}`}>{tab.label}</button>
              ))}
            </nav>
            
            <div className="flex items-center gap-4">
              <button onClick={() => setLanguage(l => l === 'PT' ? 'EN' : 'PT')} className={`text-xs font-bold px-2 py-1 border ${theme.border} rounded hover:bg-white hover:text-black transition-colors`}>{language}</button>
              <button onClick={() => setActiveTab('client')} className={`relative cursor-pointer transition-colors ${activeTab === 'client' ? theme.accent : 'opacity-60 hover:opacity-100'}`}><User size={20} /></button>
              <div className="relative cursor-pointer" onClick={() => setActiveTab('cart')}>
                <ShoppingCart className={`transition-colors ${activeTab === 'cart' ? theme.accent : 'opacity-60 hover:opacity-100'}`} />
                {cart.length > 0 && <span className="absolute -top-2 -right-2 text-[10px] w-5 h-5 flex items-center justify-center rounded-full bg-pink-600 text-white font-bold">{cart.reduce((a, b) => a + b.qty, 0)}</span>}
              </div>
            </div>
          </div>
        </header>

        <main className={`max-w-6xl mx-auto p-6 ${isTransitioning ? 'opacity-0' : 'opacity-100 warp-effect'}`}>
          
          {/* LOJA NORMAL (HOME) */}
          {activeTab === 'home' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <section className={`${theme.card} p-12 rounded-2xl text-center mb-12`}>
                <div className={`mx-auto mb-4 w-16 h-16 ${theme.accent} flex items-center justify-center`}>{theme.icon}</div>
                <h2 className="text-4xl md:text-5xl font-display mb-4">{language === 'PT' ? 'Dê vida à sua imaginação' : 'Bring your imagination to life'}</h2>
                <p className="opacity-70 max-w-lg mx-auto mb-8">{language === 'PT' ? 'Produtos customizados únicos. Do digital para o real, com qualidade premium.' : 'Unique custom products. From digital to real, with premium quality.'}</p>
                <button onClick={() => setActiveTab('lab')} className={`py-3 px-8 font-bold ${theme.button}`}>{language === 'PT' ? 'QUERO ALGO ÚNICO (IR PARA LABS)' : 'I WANT SOMETHING UNIQUE (GO TO LABS)'}</button>
              </section>

              <h3 className="text-xl font-display opacity-60 mb-6 flex items-center gap-2"><Box size={20}/> {language === 'PT' ? 'CATÁLOGO OFICIAL' : 'OFFICIAL CATALOG'}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className={`${theme.card} p-4 transition-all group`}>
                    <div className="h-40 mb-4 flex items-center justify-center text-6xl bg-black/10 group-hover:scale-110 transition-transform">{product.image}</div>
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-sm">{product.name}</h4>
                        <span className="text-[10px] opacity-50 border border-current px-1 rounded">{product.category}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`${theme.accent} font-mono font-bold`}>{product.price.toFixed(2)}€</span>
                      <button onClick={() => addToCart(product)} className={`text-xs px-3 py-1 font-bold transition-colors ${currentUniverse === 'paper' ? 'bg-black text-white' : 'bg-white/20 hover:bg-white/40'} rounded`}>+ ADD</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LAB FUSÃO (IA) */}
          {activeTab === 'lab' && (
            <div className="animate-in fade-in slide-in-from-right-4 max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <span className={`${theme.accent} border border-current px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block opacity-70`}><Sparkles size={12} className="inline mr-2"/> Powered by Gemini</span>
                <h2 className="text-4xl font-display mb-2">{language === 'PT' ? 'LABORATÓRIO DE FUSÃO' : 'FUSION LAB'}</h2>
                <p className="opacity-60">{language === 'PT' ? 'Não encontras o que queres? A nossa IA cria por ti.' : 'Can\'t find what you want? Our AI creates it for you.'}</p>
              </div>
              <div className={`${theme.card} p-8 rounded-lg shadow-2xl relative overflow-hidden`}>
                <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
                  <div className="w-full relative">
                    <label className={`text-xs ${theme.accent} font-bold ml-2 mb-1 block`}>TEMA A</label>
                    <input value={item1} onChange={(e) => setItem1(e.target.value)} placeholder="Ex: Batman" className={`w-full bg-black/20 border-2 ${theme.border} text-inherit p-4 rounded-lg outline-none font-bold text-center`}/>
                  </div>
                  <div className="text-2xl font-display">+</div>
                  <div className="w-full relative">
                    <label className={`text-xs ${theme.accent} font-bold ml-2 mb-1 block`}>TEMA B</label>
                    <input value={item2} onChange={(e) => setItem2(e.target.value)} placeholder="Ex: Torradeira" className={`w-full bg-black/20 border-2 ${theme.border} text-inherit p-4 rounded-lg outline-none font-bold text-center`}/>
                  </div>
                </div>
                <button onClick={handleFusion} disabled={loading || !item1 || !item2} className={`w-full py-4 text-xl font-display flex justify-center items-center gap-3 transition-all ${theme.button} disabled:opacity-50`}>
                  {loading ? <Loader className="animate-spin"/> : <Zap fill="currentColor"/>} {loading ? statusMsg : (language === 'PT' ? "CRIAR MASHUP" : "CREATE MASHUP")}
                </button>
                {fusionResult && !loading && (
                  <div className={`mt-8 border-t ${theme.border} pt-8 animate-in slide-in-from-bottom-10`}>
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className={`w-full md:w-1/2 aspect-square bg-black/10 rounded-lg flex items-center justify-center border ${theme.border} overflow-hidden relative group`}>
                        {fusionImage ? <><img src={fusionImage} className="w-full h-full object-cover"/><div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">IA PREVIEW</div></> : <div className="opacity-50 animate-pulse text-sm">...</div>}
                      </div>
                      <div className="w-full md:w-1/2 flex flex-col justify-center">
                        <h3 className={`text-3xl font-display mb-2 ${theme.accent}`}>{fusionResult.nome}</h3>
                        <p className="italic opacity-80 mb-6 border-l-2 pl-4 border-current">"{fusionResult.descricao}"</p>
                        <button onClick={() => {addToCart({ id: Date.now(), name: fusionResult.nome, price: 45, image: "✨" }); setActiveTab('cart');}} className={`py-3 border border-current hover:opacity-50 transition-colors uppercase font-bold text-xs`}>{language === 'PT' ? 'ENCOMENDAR (45€)' : 'ORDER (45€)'}</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CUSTOM FORGE */}
          {activeTab === 'custom' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500 max-w-3xl mx-auto">
               <div className="text-center mb-10">
                <span className={`${theme.accent} mb-2 block`}><Gift className="inline mb-1" size={20}/> {language === 'PT' ? 'ÁREA DE PRESENTES' : 'GIFT AREA'}</span>
                <h2 className="text-4xl font-display mb-2">CUSTOM FORGE</h2>
                <p className="opacity-60">{language === 'PT' ? 'Ideal para presentes. Descreve a pessoa e nós criamos o boneco.' : 'Perfect for gifts. Describe the person and we create the figure.'}</p>
              </div>
              <div className={`${theme.card} p-8 shadow-2xl`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold opacity-50 mb-2">{language === 'PT' ? 'NOME DO ALVO' : 'TARGET NAME'}</label>
                    <input value={customName} onChange={e => setCustomName(e.target.value)} placeholder="Ex: João" className={`w-full bg-black/20 border ${theme.border} p-3 rounded text-inherit outline-none`}/>
                  </div>
                  <div>
                     <label className="block text-sm font-bold opacity-50 mb-2">{language === 'PT' ? 'FOTOS DE REFERÊNCIA' : 'REFERENCE PHOTOS'}</label>
                     <div className={`border-2 border-dashed ${theme.border} hover:opacity-100 opacity-50 rounded p-2 flex items-center justify-center gap-2 cursor-pointer h-[50px]`}><Upload size={16}/> <span className="text-xs">UPLOAD</span></div>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-bold opacity-50 mb-2">{language === 'PT' ? 'DESCRIÇÃO (Hobbies, Gostos...)' : 'DESCRIPTION (Hobbies, Likes...)'}</label>
                  <textarea value={customDesc} onChange={e => setCustomDesc(e.target.value)} placeholder="..." className={`w-full h-32 bg-black/20 border ${theme.border} p-3 rounded text-inherit outline-none resize-none`}></textarea>
                </div>
                <button onClick={handleCustom} disabled={loading || !customDesc} className={`w-full py-3 font-bold transition-colors flex justify-center items-center gap-2 ${theme.button}`}>
                  {loading ? <Loader className="animate-spin"/> : <Terminal size={18}/>} {loading ? statusMsg : (language === 'PT' ? "GERAR PROJETO" : "GENERATE PROJECT")}
                </button>
                {customBlueprint && !loading && (
                  <div className="mt-8 bg-black/10 p-6 rounded border border-current font-mono text-sm relative">
                    <div className={`absolute -top-3 left-4 ${theme.bgClass} border border-current px-2 py-0.5 text-xs font-bold rounded`}>BLUEPRINT</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><span className="opacity-50 block text-xs mb-1">CODENAME</span><strong className={`${theme.accent} text-lg`}>{customBlueprint.codename}</strong></div>
                      <div><span className="opacity-50 block text-xs mb-1">ACESSÓRIOS</span><ul className="list-disc list-inside opacity-80">{Array.isArray(customBlueprint.acessorios) ? customBlueprint.acessorios.map(a => <li key={a}>{a}</li>) : <li>{customBlueprint.acessorios}</li>}</ul></div>
                    </div>
                    <div className={`mt-4 pt-4 border-t ${theme.border}`}><span className="opacity-50 block text-xs mb-1">NOTAS</span><p className="italic opacity-80">"{customBlueprint.obs}"</p></div>
                    <button className="w-full mt-4 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black py-2 text-xs font-bold uppercase transition-colors">{language === 'PT' ? 'APROVAR PROJETO' : 'APPROVE PROJECT'}</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CLIENT AREA */}
          {activeTab === 'client' && (
            <div className="animate-in fade-in slide-in-from-right-4 max-w-4xl mx-auto">
              <h2 className={`text-3xl font-display mb-8 pb-4 border-b ${theme.border} flex items-center gap-3`}><User size={32} /> {language === 'PT' ? 'ÁREA DE CLIENTE' : 'CLIENT AREA'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className={`${theme.card} p-6 h-fit`}>
                  <div className="text-center mb-6">
                    <div className={`w-20 h-20 mx-auto bg-black/20 rounded-full flex items-center justify-center text-4xl mb-3 border-2 ${theme.border}`}>👽</div>
                    <h3 className="font-bold text-xl">{clientData.name}</h3>
                    <p className="opacity-60 text-xs">{clientData.email}</p>
                  </div>
                  <div className="space-y-2">
                    <button className={`w-full text-left py-2 px-3 hover:bg-white/10 rounded flex items-center gap-2 ${theme.accent}`}><Package size={16}/> {language === 'PT' ? 'Minhas Encomendas' : 'My Orders'}</button>
                    <button className="w-full text-left py-2 px-3 hover:bg-white/10 rounded flex items-center gap-2 opacity-50"><MapPin size={16}/> {language === 'PT' ? 'Moradas' : 'Addresses'}</button>
                    <button className="w-full text-left py-2 px-3 hover:bg-white/10 rounded flex items-center gap-2 text-red-500 mt-4 border-t border-white/10 pt-4"><LogOut size={16}/> {language === 'PT' ? 'Sair' : 'Log Out'}</button>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <h4 className="font-bold opacity-70 mb-4">{language === 'PT' ? 'HISTÓRICO RECENTE' : 'RECENT HISTORY'}</h4>
                  {clientData.orders.map((order) => (
                    <div key={order.id} className={`${theme.card} p-4 flex justify-between items-center group`}>
                      <div><div className="font-bold text-lg flex items-center gap-2">{order.id} <span className={`text-[10px] px-2 py-0.5 rounded-full border border-current ${order.status === 'Entregue' ? 'text-green-500 border-green-500' : 'text-yellow-500 border-yellow-500'}`}>{order.status}</span></div><p className="text-xs opacity-60">{order.date}</p></div>
                      <div className="text-right"><p className="font-mono font-bold">{order.total}</p><button className="text-xs underline hover:opacity-100 opacity-50 mt-1">{language === 'PT' ? 'Ver Detalhes' : 'View Details'}</button></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CARRINHO */}
          {activeTab === 'cart' && (
            <div className="animate-in fade-in slide-in-from-right-4 max-w-4xl mx-auto">
              <h2 className={`text-3xl font-display mb-8 pb-4 border-b ${theme.border}`}>{language === 'PT' ? 'SEU INVENTÁRIO' : 'YOUR INVENTORY'}</h2>
              {cart.length === 0 ? (
                <div className="text-center py-20 opacity-50"><ShoppingCart size={48} className="mx-auto mb-4"/><p>{language === 'PT' ? 'O CARRINHO ESTÁ VAZIO.' : 'CART IS EMPTY.'}</p><button onClick={() => setActiveTab('home')} className={`mt-4 ${theme.accent} underline`}>{language === 'PT' ? 'VOLTAR À BASE' : 'BACK TO BASE'}</button></div>
              ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className={`${theme.card} p-4 flex items-center gap-4 relative`}>
                        <div className={`w-16 h-16 flex items-center justify-center text-2xl ${currentUniverse === 'paper' ? 'border-2 border-black' : 'bg-black/30'}`}>{item.image}</div>
                        <div className="flex-1"><h4 className="font-bold">{item.name}</h4><p className={`${theme.accent} text-sm`}>{item.price.toFixed(2)}€</p></div>
                        <div className={`flex items-center gap-3 p-1 ${currentUniverse === 'paper' ? 'border-2 border-black' : 'bg-black/20'}`}><button onClick={() => updateQty(item.id, -1)} className="p-1"><Minus size={14}/></button><span className="font-mono text-sm w-4 text-center">{item.qty}</span><button onClick={() => updateQty(item.id, 1)} className="p-1"><Plus size={14}/></button></div>
                        <button onClick={() => removeItem(item.id)} className="opacity-50 hover:opacity-100 ml-2"><Trash2 size={18}/></button>
                      </div>
                    ))}
                  </div>
                  <div className="lg:w-80">
                    <div className={`${theme.card} p-6 sticky top-24`}>
                      <h3 className="font-display text-xl mb-4">{language === 'PT' ? 'RESUMO' : 'SUMMARY'}</h3>
                      <div className={`space-y-2 text-sm opacity-70 mb-6 border-b pb-4 ${theme.border}`}>
                        <div className="flex justify-between"><span>Subtotal</span><span>{cartTotal.toFixed(2)}€</span></div>
                        <div className="flex justify-between"><span>Envio</span><span>3.50€</span></div>
                      </div>
                      <div className="flex justify-between text-xl font-bold mb-6"><span>TOTAL</span><span className={theme.accent}>{(cartTotal + 3.50).toFixed(2)}€</span></div>
                      <button onClick={() => setIsCheckoutOpen(true)} className={`w-full py-3 font-bold transition-all ${theme.button}`}>{language === 'PT' ? 'FINALIZAR' : 'CHECKOUT'}</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>

        {/* CHECKOUT MODAL */}
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`${theme.bgClass} ${theme.text} ${theme.border} border-2 w-full max-w-lg shadow-2xl relative p-6 max-h-[90vh] overflow-y-auto`}>
              <div className={`flex justify-between items-center mb-6 border-b ${theme.border} pb-2`}><h3 className={`font-display text-xl ${theme.accent}`}>CHECKOUT</h3><button onClick={() => setIsCheckoutOpen(false)}><X/></button></div>
              {checkoutStep === 1 && (
                <div className="animate-in slide-in-from-right">
                  <h4 className="font-bold mb-4 flex items-center gap-2"><MapPin size={18}/> {language === 'PT' ? 'ONDE ENTREGAMOS?' : 'WHERE TO DELIVER?'}</h4>
                  <div className="space-y-3 mb-6">
                    <input placeholder={language === 'PT' ? "Nome Completo" : "Full Name"} className={`w-full bg-black/20 border ${theme.border} p-3 outline-none`} onChange={e => setAddressData({...addressData, name: e.target.value})}/>
                    <input placeholder={language === 'PT' ? "Morada" : "Address"} className={`w-full bg-black/20 border ${theme.border} p-3 outline-none`} onChange={e => setAddressData({...addressData, address: e.target.value})}/>
                    <div className="flex gap-3"><input placeholder="Código Postal" className={`w-1/3 bg-black/20 border ${theme.border} p-3 outline-none`} onChange={e => setAddressData({...addressData, zip: e.target.value})}/><input placeholder="Cidade" defaultValue="Lisboa" className={`w-2/3 bg-black/20 border ${theme.border} p-3 outline-none`} onChange={e => setAddressData({...addressData, city: e.target.value})}/></div>
                  </div>
                  <button onClick={() => setCheckoutStep(2)} className={`w-full py-3 font-bold ${theme.button}`}>{language === 'PT' ? 'SEGUINTE: PAGAMENTO' : 'NEXT: PAYMENT'}</button>
                </div>
              )}
              {checkoutStep === 2 && (
                <div className="animate-in slide-in-from-right">
                   <h4 className="font-bold mb-4 flex items-center gap-2"><CreditCard size={18}/> {language === 'PT' ? 'COMO QUERES PAGAR?' : 'PAYMENT METHOD'}</h4>
                   <div className="space-y-3 mb-6">
                     <div onClick={sendToWhatsApp} className={`flex items-center gap-3 p-4 border ${theme.border} cursor-pointer hover:bg-white/10 transition-colors`}><div className="bg-green-500 p-2 rounded-full text-white"><MessageCircle size={24}/></div><div><div className="font-bold">MB WAY (Via WhatsApp)</div><div className="text-xs opacity-70">Falar diretamente com a loja</div></div></div>
                     <div className={`flex items-center gap-3 p-4 border ${theme.border} cursor-pointer opacity-50`}><div className="bg-gray-500 p-2 rounded-full text-white"><CreditCard size={24}/></div><div><div className="font-bold">Cartão de Crédito</div><div className="text-xs opacity-70">Indisponível no momento</div></div></div>
                   </div>
                   <div className="flex gap-3"><button onClick={() => setCheckoutStep(1)} className="w-full border border-current opacity-50 hover:opacity-100 py-2">{language === 'PT' ? 'VOLTAR' : 'BACK'}</button></div>
                </div>
              )}
              {checkoutStep === 3 && (
                <div className="text-center py-8 animate-in zoom-in">
                   <CheckCircle size={64} className="mx-auto text-green-500 mb-4"/><h4 className="text-2xl font-display mb-2">{language === 'PT' ? 'PEDIDO ENVIADO!' : 'ORDER SENT!'}</h4><p className="opacity-70 mb-6">Verifica o teu WhatsApp para concluir o pagamento.</p>
                   <button onClick={() => {setIsCheckoutOpen(false); setCheckoutStep(1); setCart([]); setActiveTab('home')}} className={`px-6 py-2 border border-current hover:bg-white hover:text-black transition-colors`}>{language === 'PT' ? 'FECHAR' : 'CLOSE'}</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlitchStore;
