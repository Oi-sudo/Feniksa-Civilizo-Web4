import Link from 'next/link';

type Props={locale:'zh'|'eo'|'en';current?:string};

const labels={
 zh:{title:'桃花源跨区导航',city:'城市与交通',school:'世界语文明大学',dad:'DAD议事区',museum:'数字博物馆',elder:'长者康养',buddhist:'佛法修学'},
 eo:{title:'Trans-zona navigado de Persikflora Lando',city:'Urbo kaj transporto',school:'Esperanta Civiliza Universitato',dad:'DAD-konsilia zono',museum:'Cifereca Muzeo',elder:'Prizorgo por maljunuloj',buddhist:'Budhisma studzono'},
 en:{title:'Peach Blossom Land cross-district navigation',city:'City & transport',school:'Esperanto Civilization University',dad:'DAD council district',museum:'Digital Museum',elder:'Elder care',buddhist:'Buddhist study'}
};

const zones=[
 ['city','/taohuayuan/city'],
 ['school','/courses'],
 ['dad','/dad'],
 ['museum','/museum'],
 ['elder','/taohuayuan/eldercare'],
 ['buddhist','/taohuayuan/buddhist-study']
] as const;

export default function TaohuayuanZoneNav({locale,current}:Props){
 const t=labels[locale]||labels.zh;
 return <nav className="zone-nav" aria-label={t.title}>
  <strong>{t.title}</strong>
  <div className="zone-nav-links">
   {zones.map(([key,href])=><Link key={key} href={href} aria-current={current===key?'page':undefined} className={current===key?'active':''}>{t[key]}</Link>)}
  </div>
 </nav>;
}
