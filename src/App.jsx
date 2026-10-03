import {useEffect,useState} from 'react';
import Topbar from './components/Topbar';
import Home from './pages/Home';
import Research from './pages/Research';
import Topics from './pages/Topics';
import DeepDive from './pages/DeepDive';

function path(){const p=window.location.pathname||'/';return p.length>1?p.replace(/\/+$/,''):p}

export default function App(){
  const [p,setP]=useState(path());
  useEffect(()=>{const f=()=>setP(path());window.addEventListener('popstate',f);return()=>window.removeEventListener('popstate',f)},[]);
  function navigate(to){window.history.pushState({},'',to);setP(to);window.scrollTo({top:0,behavior:'smooth'})}
  let page=<Home navigate={navigate}/>;
  if(p==='/research')page=<Research/>;
  else if(p==='/topics')page=<Topics/>;
  else if(p==='/deep-dive')page=<DeepDive/>;
  return <><Topbar path={p} navigate={navigate}/><main>{page}</main><footer><span>Tadabbur</span><span>Quran Research</span><span>Arabic · English · Urdu · Roman Urdu</span></footer></>
}
