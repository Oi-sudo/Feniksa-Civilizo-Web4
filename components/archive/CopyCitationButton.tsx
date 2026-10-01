'use client';

import { useState } from 'react';

export default function CopyCitationButton({text,label,copiedLabel}:{text:string;label:string;copiedLabel:string}){
  const [copied,setCopied]=useState(false);
  async function copy(){
    try{
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(()=>setCopied(false),1800);
    }catch{
      setCopied(false);
    }
  }
  return <button type="button" className="citation-copy-button no-print" onClick={copy}>{copied?copiedLabel:label}</button>;
}
