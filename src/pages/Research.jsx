import {useState} from 'react';
import FeatureIntro from '../components/FeatureIntro';
import {Loading,ErrorBox,BackendResponse} from '../components/Feedback';
import AyahCard from '../components/AyahCard';
import SourceStrip from '../components/SourceStrip';
import Icons from '../components/Icons';
import {callFeature} from '../lib/api';

function firstObject(data){return Array.isArray(data)?(data[0]||{}):((data&&typeof data==='object')?data:{});}

export default function Research(){
  const [q,setQ]=useState('');const [lang,setLang]=useState('en');const [response,setResponse]=useState(null);const [err,setErr]=useState(null);const [loading,setLoading]=useState(false);
  async function go(e){e.preventDefault();if(!q.trim())return;setLoading(true);setErr(null);setResponse(null);try{setResponse(await callFeature('research',{requested_feature:'research',question:q.trim(),language:lang}))}catch(x){setErr(x)}finally{setLoading(false)}}
  const data=firstObject(response?.data);const candidate=data?.results||data?.ayahs||data?.relevant_ayahs;const arr=Array.isArray(candidate)?candidate:[];
  return <section className="page"><FeatureIntro number="01" label="Research" title="Quran Research" text="A focused research space for general Quran-related questions."/>
    <form className="soft-form" onSubmit={go}><textarea rows="4" value={q} onChange={e=>setQ(e.target.value)} placeholder="What does Quran say about patience?"/><div className="form-row"><select value={lang} onChange={e=>setLang(e.target.value)}><option value="en">English</option><option value="ur">Urdu</option><option value="roman_ur">Roman Urdu</option></select><button className="btn green" disabled={loading}>{loading?'Researching…':'Research'} <Icons name="arrow" size={16}/></button></div></form>
    {loading&&<Loading>Retrieving Quran evidence…</Loading>}
    {err&&<><ErrorBox message={err.message}/><BackendResponse error={err}/></>}
    {response&&!loading&&!err&&<><BackendResponse response={response}/>{data&&(data.ai_explanation||data.summary||arr.length>0||data.sources)&&<div className="answer-area">{(data.ai_explanation||data.summary)&&<div className="lead-answer"><span className="eyebrow">Structured view</span><h2>{data.summary||'Quran research response'}</h2>{data.ai_explanation&&<p>{data.ai_explanation}</p>}</div>}{arr.map((x,i)=><AyahCard key={x?.ayah_reference||x?.reference||i} ayah={x}/>)}{(Array.isArray(data.sources)||data.evidence_guard)&&<SourceStrip sources={Array.isArray(data.sources)?data.sources:[]} guard={data.evidence_guard}/>}</div>}</>}
  </section>
}
