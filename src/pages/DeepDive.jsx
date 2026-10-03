import {useState} from 'react';
import FeatureIntro from '../components/FeatureIntro';
import {Loading,ErrorBox,BackendResponse} from '../components/Feedback';
import AyahCard from '../components/AyahCard';
import {callFeature} from '../lib/api';
import Icons from '../components/Icons';
export default function DeepDive(){
  const [ref,setRef]=useState('2:153');const [lang,setLang]=useState('en');const [response,setResponse]=useState(null);const [loading,setLoading]=useState(false);const [err,setErr]=useState(null);
  async function go(e){e.preventDefault();if(!/^\d{1,3}:\d{1,3}$/.test(ref.trim())){setErr(new Error('Enter a valid ayah reference such as 2:153.'));return}setLoading(true);setErr(null);setResponse(null);try{setResponse(await callFeature('ayah_deep_dive',{requested_feature:'ayah_deep_dive',question:`Study ayah ${ref.trim()}`,ayah_reference:ref.trim(),language:lang}))}catch(x){setErr(x)}finally{setLoading(false)}}
  const data=response?.data;
  return <section className="page"><FeatureIntro number="03" label="One ayah" title="Ayah Deep Dive" text="A focused view for one specifically identified ayah. The workflow validates the reference before retrieval."/>
    <form className="soft-form narrow" onSubmit={go}><div className="reference-box"><span>AYAH REFERENCE</span><input value={ref} onChange={e=>setRef(e.target.value)} inputMode="numeric"/><small>Example · 2:153</small></div><div className="form-row"><select value={lang} onChange={e=>setLang(e.target.value)}><option value="en">English</option><option value="ur">Urdu</option><option value="roman_ur">Roman Urdu</option></select><button className="btn green" disabled={loading}>{loading?'Opening…':'Open Deep Dive'} <Icons name="arrow" size={16}/></button></div></form>
    {loading&&<Loading>Looking up the exact ayah…</Loading>}{err&&<><ErrorBox message={err.message}/><BackendResponse error={err}/></>}
    {response&&!loading&&!err&&<>{data&&typeof data==='object'&&<div className="answer-area"><div className="lead-answer"><span className="eyebrow">{data.target_ayah||ref}</span><h2>{data.summary||'Ayah study'}</h2></div><AyahCard ayah={{ayah_reference:data.target_ayah||ref,arabic:data.arabic,translation:data.translation,ai_explanation:data.ai_explanation}}/>{data.key_themes&&<div className="info-block"><span className="eyebrow">Key themes</span><p>{Array.isArray(data.key_themes)?data.key_themes.join(' · '):data.key_themes}</p></div>}{data.detailed_explanation&&<div className="ai-note large"><span>AI-generated detailed explanation</span><p>{data.detailed_explanation}</p></div>}{Array.isArray(data.reflection_questions)&&<div className="info-block"><span className="eyebrow">Reflection</span><ol>{data.reflection_questions.map((x,i)=><li key={i}>{x}</li>)}</ol></div>}</div>}<BackendResponse response={response}/></>}
  </section>
}
