import {useState} from 'react';
import FeatureIntro from '../components/FeatureIntro';
import {Loading,ErrorBox,BackendResponse} from '../components/Feedback';
import AyahCard from '../components/AyahCard';
import SourceStrip from '../components/SourceStrip';
import Icons from '../components/Icons';
import {callFeature} from '../lib/api';

function firstObject(data){return Array.isArray(data)?(data[0]||{}):((data&&typeof data==='object')?data:{});}
const suggested=['Patience','Gratitude','Mercy','Hope','Forgiveness','Tawakkul'];

export default function Topics(){
  const [topic,setTopic]=useState('');const [lang,setLang]=useState('en');const [response,setResponse]=useState(null);const [loading,setLoading]=useState(false);const [err,setErr]=useState(null);
  async function go(e){e.preventDefault();if(!topic.trim())return;setLoading(true);setErr(null);setResponse(null);try{setResponse(await callFeature('topic_explorer',{requested_feature:'topic_explorer',topic:topic.trim(),question:topic.trim(),language:lang}))}catch(x){setErr(x)}finally{setLoading(false)}}
  const data=firstObject(response?.data);const candidate=data?.results||data?.ayahs||data?.relevant_ayahs;const arr=Array.isArray(candidate)?candidate:[];
  return <section className="page"><FeatureIntro number="02" label="Themes" title="Topic Explorer" text="Explore a Quranic theme through the dedicated n8n workflow."/>
    <form className="soft-form" onSubmit={go}><input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Enter a theme, such as patience during hardship"/><div className="suggested">{suggested.map(s=><button type="button" key={s} onClick={()=>setTopic(s)}>{s}</button>)}</div><div className="form-row"><select value={lang} onChange={e=>setLang(e.target.value)}><option value="en">English</option><option value="ur">Urdu</option><option value="roman_ur">Roman Urdu</option></select><button className="btn green" disabled={loading}>{loading?'Exploring…':'Explore topic'} <Icons name="arrow" size={16}/></button></div></form>
    {loading&&<Loading>Finding relevant Quran evidence…</Loading>}
    {err&&<><ErrorBox message={err.message}/><BackendResponse error={err}/></>}
    {response&&!loading&&!err&&<><BackendResponse response={response}/>{data&&(data.title||data.summary||data.ai_explanation||arr.length>0||data.sources)&&<div className="answer-area"><div className="lead-answer"><span className="eyebrow">Structured view</span><h2>{data.title||data.summary||topic}</h2>{data.ai_explanation&&<p>{data.ai_explanation}</p>}</div>{arr.map((x,i)=><AyahCard key={x?.ayah_reference||x?.reference||i} ayah={x}/>)}{(Array.isArray(data.sources)||data.evidence_guard)&&<SourceStrip sources={Array.isArray(data.sources)?data.sources:[]} guard={data.evidence_guard}/>}</div>}</>}
  </section>
}
