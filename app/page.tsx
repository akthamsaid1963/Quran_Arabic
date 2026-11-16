'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { surahs } from '@/lib/surahs';

type Lang = 'ar' | 'en' | 'de' | 'fr';
type Reciter = { id: number; name: string };
type Verse = {
  id: number; verse_number: number; text_uthmani?: string; text_uthmani_tajweed?: string;
  audio?: { url?: string }; translations?: { text?: string }[]; tafsirs?: { text?: string }[];
};
const API = 'https://api.quran.com/api/v4';
const copy: Record<Lang, Record<string,string>> = {
  ar: { brand:'البيان', tagline:'القرآن الكريم · التلاوة · التدبر', title:'رحلتك مع القرآن الكريم', intro:'اقرأ واستمع وتدبّر آيات القرآن الكريم', search:'ابحث عن سورة...', surahs:'فهرس السور', translation:'الترجمة', tafsir:'التفسير الميسر', reciter:'القارئ', repeat:'تكرار الآية', once:'مرة واحدة', continuous:'بلا حدود', play:'استمع', playAll:'تشغيل السورة', stop:'إيقاف', loading:'جارٍ تحميل الآيات...', choose:'اختر سورة للبدء', ayah:'آية', noAudio:'لا يتوفر تسجيل لهذه الآية من القارئ المختار.', source:'مصادر النصوص والتسجيلات تخضع لشروط مزوديها. يرجى مراجعة الإسناد والتراخيص قبل إعادة النشر.' },
  en: { brand:'AL-BAYAN', tagline:'QURAN · RECITATION · REFLECTION', title:'A journey through the Holy Quran', intro:'Read, listen and reflect on every verse.', search:'Search Surah...', surahs:'Surah index', translation:'Translation', tafsir:'Tafsir', reciter:'Reciter', repeat:'Repeat verse', once:'Once', continuous:'Continuous', play:'Listen', playAll:'Play Surah', stop:'Stop', loading:'Loading verses...', choose:'Choose a Surah to begin', ayah:'Ayah', noAudio:'No recording is available for this verse from the selected reciter.', source:'Text, translations and recordings remain subject to their providers’ attribution and reuse terms.' },
  de: { brand:'AL-BAYAN', tagline:'KORAN · REZITATION · REFLEXION', title:'Eine Reise durch den Heiligen Koran', intro:'Lesen, hören und über jeden Vers nachdenken.', search:'Sure suchen...', surahs:'Sure-Verzeichnis', translation:'Übersetzung', tafsir:'Tafsir', reciter:'Rezitator', repeat:'Vers wiederholen', once:'Einmal', continuous:'Unbegrenzt', play:'Anhören', playAll:'Sure abspielen', stop:'Stopp', loading:'Verse werden geladen...', choose:'Wähle eine Sure', ayah:'Vers', noAudio:'Für diesen Vers ist keine Aufnahme des gewählten Rezitators verfügbar.', source:'Texte und Aufnahmen unterliegen den Quellen- und Lizenzbedingungen.' },
  fr: { brand:'AL-BAYAN', tagline:'CORAN · RÉCITATION · MÉDITATION', title:'Un voyage à travers le Saint Coran', intro:'Lisez, écoutez et méditez chaque verset.', search:'Rechercher une sourate...', surahs:'Index des sourates', translation:'Traduction', tafsir:'Tafsir', reciter:'Récitateur', repeat:'Répéter le verset', once:'Une fois', continuous:'En continu', play:'Écouter', playAll:'Lire la sourate', stop:'Arrêter', loading:'Chargement des versets...', choose:'Choisissez une sourate', ayah:'Verset', noAudio:'Aucun enregistrement de ce récitateur pour ce verset.', source:'Les textes et enregistrements restent soumis aux conditions des fournisseurs.' }
};
const preferred = ['Mahmoud Khalil Al-Husary','Abdul Basit','Mohamed Siddiq Al-Minshawi','Mustafa Ismail','Mahmoud Ali Al-Banna','Mohamed Mahmoud Al-Tablawi','Mishary Rashid Alafasy','Abdulrahman Al-Sudais','Saud Al-Shuraim','Maher Al-Muaiqly','Yasser Al-Dosari','Abu Bakr Al-Shatri','Nasser Al-Qatami','Idris Abkar','Hani Al-Rifai','Fares Abbad','Hicham El Harraz','Abdulrahman Al-Shahat','Abdullah Khayyat'];
const tajweedLegend = [{name:'غنة وإخفاء',color:'taj-green'},{name:'إدغام',color:'taj-blue'},{name:'مد وإقلاب',color:'taj-purple'},{name:'قلقلة',color:'taj-orange'}];

export default function Home() {
  const [lang,setLang] = useState<Lang>('ar');
  const [query,setQuery] = useState('');
  const [chapter,setChapter] = useState(1);
  const [verses,setVerses] = useState<Verse[]>([]);
  const [reciters,setReciters] = useState<Reciter[]>([]);
  const [reciter,setReciter] = useState(7);
  const [reciterSearch,setReciterSearch] = useState('');
  const [repeat,setRepeat] = useState('1');
  const [active,setActive] = useState<number|null>(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');
  const [playingAll,setPlayingAll] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const repeatRef = useRef(0);
  const t = copy[lang];
  const current = surahs.find(s=>s.id===chapter)!;
  const filtered = useMemo(()=>surahs.filter(s=>(s.transliteration+' '+s.english+' '+s.arabic).toLowerCase().includes(query.toLowerCase())),[query]);
  const filteredReciters = useMemo(()=>reciters.filter(r=>r.name.toLowerCase().includes(reciterSearch.toLowerCase())),[reciters,reciterSearch]);

  useEffect(()=>{ fetch(API+'/resources/recitations?language=en').then(r=>r.json()).then(d=>{
    const list:Reciter[]=(d.recitations||[]).map((x:{id:number;reciter_name?:string;name?:string})=>({id:x.id,name:x.reciter_name||x.name||'Unknown reciter'}));
    list.sort((a,b)=>{const ai=preferred.findIndex(n=>a.name.toLowerCase().includes(n.toLowerCase()));const bi=preferred.findIndex(n=>b.name.toLowerCase().includes(n.toLowerCase()));return (ai<0?999:ai)-(bi<0?999:bi);});
    setReciters(list); if(list.length && !list.some(x=>x.id===7))setReciter(list[0].id);
  }).catch(()=>setError('تعذر تحميل قائمة القراء.')); },[]);

  const loadVerses = useCallback(async(id:number,language:Lang,reader:number)=>{
    setLoading(true);setError('');setActive(null);setPlayingAll(false);setVerses([]);
    try {
      // Tafsir Al-Muyassar is an Arabic tafsir. Fetch its resource ID from
      // the Arabic catalogue regardless of the interface language.
      const [translationCatalog, tafsirCatalog] = await Promise.all([
        language==='ar'
          ? Promise.resolve({translations:[]})
          : fetch(API+'/resources/translations?language='+language).then(r=>{if(!r.ok)throw new Error('Translation catalogue unavailable');return r.json();}),
        fetch(API+'/resources/tafsirs?language=ar').then(r=>{if(!r.ok)throw new Error('Tafsir catalogue unavailable');return r.json();})
      ]);
      const terms:Record<Exclude<Lang,'ar'>,string[]> = {
        en:['sahih international','clear quran'],
        de:['bubenheim','khoury'],
        fr:['hamidullah']
      };
      const translations=(translationCatalog.translations||[]) as {id:number;name?:string}[];
      const selectedTranslation = language==='ar' ? undefined : translations.find(x=>{
        const name=(x.name||'').toLowerCase();
        return terms[language].some(term=>name.includes(term));
      });
      const tafsirs=(tafsirCatalog.tafsirs||[]) as {id:number;name?:string}[];
      const muyassar=tafsirs.find(x=>{
        const name=(x.name||'').toLowerCase();
        return name.includes('muyassar') || name.includes('الميسر');
      });
      if(language!=='ar' && !selectedTranslation) {
        throw new Error('لم نعثر على ترجمة موثوقة للغة المختارة؛ لن نعرض ترجمة بلغة أخرى.');
      }
      if(!muyassar) throw new Error('تعذر العثور على مورد التفسير الميسر.');

      // Quran.com caps this endpoint at 50 verses per page.
      const allVerses:Verse[]=[];
      let page=1;
      let totalPages=1;
      do {
        const params=new URLSearchParams({
          language,
          fields:'text_uthmani,text_uthmani_tajweed',
          per_page:'50',
          page:String(page),
          tafsirs:String(muyassar.id)
        });
        if(selectedTranslation) params.set('translations',String(selectedTranslation.id));
        const response=await fetch(API+'/verses/by_chapter/'+id+'?'+params.toString());
        if(!response.ok) throw new Error('Verse request failed: HTTP '+response.status);
        const data=await response.json();
        allVerses.push(...((data.verses||[]) as Verse[]));
        totalPages=Number(data.pagination?.total_pages||1);
        page+=1;
      } while(page<=totalPages && page<=10);

      // Load ayah audio files separately and join by canonical verse_key.
      // Some API versions return relative CDN paths, so normalize those too.
      const audioByKey:Record<string,string>={};
      try {
        let audioPage=1;
        let audioPages=1;
        do {
          const audioResponse=await fetch(API+'/recitations/'+reader+'/by_chapter/'+id+'?per_page=50&page='+audioPage);
          if(!audioResponse.ok) throw new Error('Audio catalogue unavailable');
          const audioData=await audioResponse.json();
          for(const file of (audioData.audio_files||[]) as {verse_key?:string;url?:string}[]) {
            if(file.verse_key && file.url) {
              audioByKey[file.verse_key]=new URL(file.url,'https://verses.quran.foundation/').toString();
            }
          }
          audioPages=Number(audioData.pagination?.total_pages||1);
          audioPage+=1;
        } while(audioPage<=audioPages && audioPage<=10);
      } catch {
        // Keep verse text and tafsir available if the audio service is down.
      }

      const merged=allVerses.map(v=>({
        ...v,
        audio:{url:audioByKey[id+':'+v.verse_number] || v.audio?.url}
      }));
      if(merged.length===0) throw new Error('No verses returned by the Quran service.');
      setVerses(merged);
    } catch(e) {
      setVerses([]);
      setError(e instanceof Error ? e.message : 'تعذر تحميل محتوى السورة حالياً. حاول مرة أخرى.');
    } finally {setLoading(false);}
  },[]);
  useEffect(()=>{loadVerses(chapter,lang,reciter);},[chapter,lang,reciter,loadVerses]);

  const playVerse = (index:number,all=false) => {
    const verse=verses[index]; const url=verse?.audio?.url;
    if(!url){setError(t.noAudio);return;}
    if(audioRef.current){audioRef.current.src=url;audioRef.current.load();audioRef.current.play().catch(()=>setError(t.noAudio));}
    setActive(index);setPlayingAll(all);repeatRef.current=0;
  };
  const onEnded = () => {
    const total=Number(repeat);
    if(total===0 || repeatRef.current<total-1){repeatRef.current++;if(audioRef.current){audioRef.current.currentTime=0;audioRef.current.play().catch(()=>{});}return;}
    repeatRef.current=0;
    if(playingAll && active!==null && active<verses.length-1)playVerse(active+1,true);
    else setPlayingAll(false);
  };
  const stop = () => {audioRef.current?.pause();setActive(null);setPlayingAll(false);};
  const playAll = () => {const first=verses.findIndex(v=>Boolean(v.audio?.url));if(first>=0)playVerse(first,true);else setError(t.noAudio);};
  const chooseChapter = (id:number) => {setChapter(id);setQuery('');};

  return <main className="site" dir={lang==='ar'?'rtl':'ltr'}>
    <header className="topbar"><a className="brand" href="#"><span className="brand-mark">۞</span><span><b>{t.brand}</b><small>{t.tagline}</small></span></a><div className="top-actions"><span className="header-note">114 سورة · 4 لغات</span><select aria-label="Language" value={lang} onChange={e=>setLang(e.target.value as Lang)}><option value="ar">العربية</option><option value="en">English</option><option value="de">Deutsch</option><option value="fr">Français</option></select></div></header>
    <section className="hero"><div className="hero-copy"><span className="eyebrow">القرآن الكريم · AL-QURAN</span><h1>{t.title}</h1><p>{t.intro}</p><div className="stats"><span><b>114</b> {t.surahs}</span><span><b>4</b> لغات</span><span><b>∞</b> تدبّر</span></div></div><div className="hero-art"><div className="ornament">۞</div><div className="hero-verse">وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ</div><small>سورة القمر · ١٧</small></div></section>
    <section className="workspace"><aside className="surah-panel"><div className="panel-title"><div><span className="eyebrow">BROWSE</span><h2>{t.surahs}</h2></div><span className="count">114</span></div><input className="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search}/><div className="surah-list">{filtered.map(s=><button key={s.id} className={'surah-item '+(s.id===chapter?'selected':'')} onClick={()=>chooseChapter(s.id)}><span className="surah-number">{s.id}</span><span className="surah-info"><b>{s.transliteration}</b><small>{s.english} · {s.verses}</small></span><span className="surah-ar">{s.arabic}</span></button>)}</div></aside>
    <section className="reader"><div className="reader-head"><div><span className="eyebrow">SURAH {String(chapter).padStart(3,'0')}</span><h2>{current.transliteration}</h2><p>{current.english} · {current.type} · {current.verses} {t.ayah}</p></div><div className="surah-title-ar">{current.arabic}</div></div>
      <div className="toolbar"><label>{t.reciter}<input className="reciter-search" value={reciterSearch} onChange={e=>setReciterSearch(e.target.value)} placeholder="ابحث عن قارئ"/></label><select value={reciter} onChange={e=>setReciter(Number(e.target.value))}>{filteredReciters.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select><label>{t.repeat}<select value={repeat} onChange={e=>setRepeat(e.target.value)}><option value="1">{t.once}</option><option value="2">2×</option><option value="3">3×</option><option value="5">5×</option><option value="10">10×</option><option value="0">{t.continuous}</option></select></label><button className="primary-button" onClick={playAll}>▶ {t.playAll}</button><button className="plain-button" onClick={stop}>■ {t.stop}</button><audio ref={audioRef} onEnded={onEnded} controls className="audio-control"/></div>
      <div className="tajweed-legend">{tajweedLegend.map(x=><span key={x.name}><i className={x.color}/> {x.name}</span>)}</div>
      {loading?<div className="empty-state">{t.loading}</div>:error?<div className="empty-state error">{error}<button onClick={()=>loadVerses(chapter,lang,reciter)}>إعادة المحاولة</button></div>:verses.length===0?<div className="empty-state">{t.choose}</div>:<div className="verse-list">{verses.map((v,i)=><article className={'verse-card '+(active===i?'is-playing':'')} key={v.id}><div className="verse-meta"><span className="ayah-number">{v.verse_number}</span><button className="listen-button" onClick={()=>playVerse(i,false)}>▶ {t.play}</button></div><div className="quran-text" lang="ar" dir="rtl" dangerouslySetInnerHTML={{__html:v.text_uthmani_tajweed||v.text_uthmani||''}}/><div className="translation-label">{t.translation}</div><p className="translation-text">{v.translations?.[0]?.text?.replace(/<[^>]*>/g,'')||'—'}</p><div className="tafsir-box"><b>{t.tafsir}</b><p>{v.tafsirs?.[0]?.text?.replace(/<[^>]*>/g,'')||'لم يتوفر تفسير بهذه اللغة لهذا الموضع.'}</p></div></article>)}</div>}
    </section></section>
    <footer className="footer"><span>۞ AL-BAYAN</span><p>{t.source}</p><a href="https://quran.com" target="_blank" rel="noreferrer">Quran.com</a> · <a href="https://quranenc.com" target="_blank" rel="noreferrer">QuranEnc</a></footer>
  </main>;
}
