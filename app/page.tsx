import Link from 'next/link';
import { getMessages } from '@/lib/i18n';

export default async function HomePage() {
  const m = await getMessages();
  const entrances = [
    { code: '01', title: m.entry_3d_title, href: '/taohuayuan', desc: m.entry_3d_desc, kicker: m.entry_3d_kicker },
    { code: '02', title: m.entry_museum_title, href: '/museum', desc: m.entry_museum_desc, kicker: m.entry_museum_kicker },
    { code: '03', title: m.entry_university_title, href: '/courses', desc: m.entry_university_desc, kicker: m.entry_university_kicker },
    { code: '04', title: m.entry_buddhist_title, href: '/courses', desc: m.entry_buddhist_desc, kicker: m.entry_buddhist_kicker },
    { code: '05', title: m.entry_dad_title, href: '/dad', desc: m.entry_dad_desc, kicker: m.entry_dad_kicker },
    { code: '06', title: m.entry_passport_title, href: '/passport', desc: m.entry_passport_desc, kicker: m.entry_passport_kicker }
  ];
  const tracks = [
    { label: 'EST', title: m.est_title, desc: m.est_desc, href: '/est', note: m.est_note },
    { label: 'BUD', title: m.bud_title, desc: m.bud_desc, href: '/bud', note: m.bud_note },
    { label: 'WFB', title: m.wfb_title, desc: m.wfb_desc, href: '/museum', note: m.wfb_note }
  ];
  return (
    <main className="home-shell">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <span className="eyebrow">{m.home_badge}</span>
          <p className="hero-kicker">{m.home_kicker}</p>
          <h1 id="home-title">{m.home_title}</h1>
          <p className="hero-subtitle">{m.home_subtitle}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/taohuayuan">{m.enter_3d}</Link>
            <a className="button button-secondary" href="#civilization-map">{m.civilization_map}</a>
          </div>
          <p className="hero-caption">{m.hero_caption}</p>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <div className="orbit-ring orbit-ring-one" />
          <div className="orbit-ring orbit-ring-two" />
          <div className="phoenix-mark">鳳</div>
          <span className="orbit-label orbit-label-one">WEB4</span>
          <span className="orbit-label orbit-label-two">DAD</span>
          <span className="orbit-label orbit-label-three">EO</span>
          <span className="orbit-label orbit-label-four">AI / SI</span>
        </div>
      </section>
      <section className="manifesto-strip" aria-label={m.home_manifesto_title}>
        <span>{m.manifesto_bridge}</span><span>{m.manifesto_learning}</span><span>{m.manifesto_service}</span><span>{m.manifesto_co_governance}</span>
      </section>
      <section className="home-section" id="civilization-map">
        <div className="section-heading"><div><span className="eyebrow">{m.map_badge}</span><h2>{m.map_title}</h2></div><p>{m.map_intro}</p></div>
        <div className="entrance-grid">
          {entrances.map((item) => <Link className="entrance-card" href={item.href} key={item.code}><div className="entrance-topline"><span>{item.code}</span><span>{item.kicker}</span></div><h3>{item.title}</h3><p>{item.desc}</p><span className="card-link">{m.open_entry} →</span></Link>)}
        </div>
      </section>
      <section className="home-section ai-si-section">
        <div className="ai-si-copy"><span className="eyebrow">AI · SI · WEB4</span><h2>{m.ai_si_title}</h2><p>{m.ai_si_desc}</p><p className="muted">{m.ai_si_note}</p></div>
        <div className="ai-si-stages" aria-label={m.ai_si_title}><div><strong>AI</strong><span>{m.ai_stage}</span></div><span className="stage-arrow">→</span><div><strong>Advanced AI</strong><span>{m.advanced_ai_stage}</span></div><span className="stage-arrow">→</span><div><strong>SI</strong><span>{m.si_stage}</span></div></div>
      </section>
      <section className="home-section">
        <div className="section-heading compact-heading"><div><span className="eyebrow">0.1 · {m.three_tracks}</span><h2>{m.three_tracks_title}</h2></div><p>{m.three_tracks_intro}</p></div>
        <div className="track-grid">{tracks.map((track) => <Link className="track-card" href={track.href} key={track.label}><span className="track-code">{track.label}</span><h3>{track.title}</h3><p>{track.desc}</p><small>{track.note}</small></Link>)}</div>
      </section>
      <section className="home-section home-principles"><span className="eyebrow">{m.principles_badge}</span><blockquote>{m.principles_quote}</blockquote><div className="principle-grid"><div><strong>{m.principle_data_title}</strong><span>{m.principle_data_desc}</span></div><div><strong>{m.principle_evidence_title}</strong><span>{m.principle_evidence_desc}</span></div><div><strong>{m.principle_ai_title}</strong><span>{m.principle_ai_desc}</span></div></div></section>
      <section className="home-notice" role="note"><strong>{m.notice_title}</strong><p>{m.home_notice}</p></section>
      <footer className="home-footer"><div><strong>Feniksa Civilizo Web4</strong><span>0.1 Alpha</span></div><p>{m.footer_line}</p></footer>
    </main>
  );
}
