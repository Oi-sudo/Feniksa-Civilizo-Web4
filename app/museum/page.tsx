import { getMessages } from '@/lib/i18n';

export default async function MuseumPage(){
  const m=await getMessages();
  return <main>
    <span className="badge">{m.museum_badge}</span>
    <h1>{m.museum_title}</h1>
    <p className="lead">{m.museum_intro}</p>
    <section className="card">
      <h2>{m.museum_nine_halls}</h2>
      <p>{m.museum_main_hall_rule}</p>
      <p>{m.museum_integrity_note}</p>
    </section>
  </main>;
}
