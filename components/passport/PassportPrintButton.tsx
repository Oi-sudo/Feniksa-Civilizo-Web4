'use client';

type Props={label:string};

export default function PassportPrintButton({label}:Props){
  return <button className="button button-secondary no-print" type="button" onClick={()=>window.print()}>{label}</button>;
}
