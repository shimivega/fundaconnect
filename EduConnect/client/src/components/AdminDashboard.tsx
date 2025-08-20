import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";

type Donation = { id: string; amount: number; donorName?: string; donorEmail?: string; provider: string; createdAt: string };
type Ad = { id: string; title: string; link: string; impressions: number; clicks: number };
type Scholarship = { id: string; sponsor: string; learnerId: string; amount: number; status: string };
type PartnerResource = { id: string; title: string; type: string; url: string };

export default function AdminDashboard() {
  const [tab, setTab] = useState("donations");
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<{ totalAmount: number; count: number } | null>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [partners, setPartners] = useState<PartnerResource[]>([]);

  async function loadAll() {
    try {
      const [d, s, a, sc, pr] = await Promise.all([
        apiRequest('GET', '/api/admin/donations').then(r => r.json()),
        apiRequest('GET', '/api/admin/donations/stats').then(r => r.json()),
        apiRequest('GET', '/api/admin/ads').then(r => r.json()),
        apiRequest('GET', '/api/admin/scholarships').then(r => r.json()),
        apiRequest('GET', '/api/partner-resources').then(r => r.json()),
      ]);
      setDonations(d); setStats(s); setAds(a); setScholarships(sc); setPartners(pr);
    } catch (e) { /* no-op */ }
  }

  useEffect(() => { loadAll(); }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="flex gap-2">
        {['donations','ads','scholarships','partner','reports'].map(t => (
          <Button key={t} variant={tab===t? 'default' : 'secondary'} onClick={() => setTab(t)}>{t}</Button>
        ))}
      </div>

      {tab === 'donations' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Donations</h2>
          <div className="mb-2 text-sm">Total: {stats ? (stats.totalAmount/100).toFixed(2) : '-'} ({stats?.count ?? 0})</div>
          <div className="space-y-2">
            {donations.map(d => (
              <div key={d.id} className="border rounded p-3 flex justify-between">
                <div>
                  <div className="font-medium">{d.donorName || 'Anonymous'}</div>
                  <div className="text-xs text-gray-500">{d.donorEmail}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{(d.amount/100).toFixed(2)} {d.provider.toUpperCase()}</div>
                  <div className="text-xs text-gray-500">{new Date(d.createdAt).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'ads' && (
        <AdsManager ads={ads} onChange={loadAll} />
      )}

      {tab === 'scholarships' && (
        <ScholarshipsManager data={scholarships} onChange={loadAll} />
      )}

      {tab === 'partner' && (
        <PartnerManager data={partners} onChange={loadAll} />
      )}
    </div>
  );
}

function AdsManager({ ads, onChange }: { ads: Ad[]; onChange: () => void }) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  async function addAd() {
    await apiRequest('POST', '/api/admin/ads', { title, link });
    setTitle(""); setLink(""); onChange();
  }
  async function remove(id: string) {
    await apiRequest('DELETE', `/api/admin/ads/${id}`);
    onChange();
  }
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input placeholder="Link" value={link} onChange={(e) => setLink(e.target.value)} />
        <Button onClick={addAd}>Add</Button>
      </div>
      <div className="space-y-2">
        {ads.map(a => (
          <div key={a.id} className="border rounded p-3 flex justify-between items-center">
            <div>
              <div className="font-medium">{a.title}</div>
              <div className="text-xs text-gray-500">{a.link}</div>
            </div>
            <div className="text-sm">{a.impressions} impressions · {a.clicks} clicks</div>
            <Button variant="destructive" onClick={() => remove(a.id)}>Remove</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScholarshipsManager({ data, onChange }: { data: Scholarship[]; onChange: () => void }) {
  const [sponsor, setSponsor] = useState("");
  const [learnerId, setLearnerId] = useState("");
  const [amount, setAmount] = useState("");
  async function add() {
    await apiRequest('POST', '/api/admin/scholarships', { sponsor, learnerId, amount: parseInt(amount, 10) });
    setSponsor(""); setLearnerId(""); setAmount(""); onChange();
  }
  async function approve(id: string) {
    await apiRequest('POST', `/api/admin/scholarships/${id}/approve`);
    onChange();
  }
  async function remove(id: string) {
    await apiRequest('DELETE', `/api/admin/scholarships/${id}`);
    onChange();
  }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        <Input placeholder="Sponsor" value={sponsor} onChange={(e) => setSponsor(e.target.value)} />
        <Input placeholder="Learner ID" value={learnerId} onChange={(e) => setLearnerId(e.target.value)} />
        <Input placeholder="Amount (cents)" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Button onClick={add}>Add</Button>
      </div>
      <div className="space-y-2">
        {data.map(s => (
          <div key={s.id} className="border rounded p-3 flex justify-between items-center">
            <div>
              <div className="font-medium">{s.sponsor}</div>
              <div className="text-xs text-gray-500">{s.learnerId}</div>
            </div>
            <div className="text-sm">{(s.amount/100).toFixed(2)} · {s.status}</div>
            <div className="flex gap-2">
              <Button onClick={() => approve(s.id)} disabled={s.status==='approved'}>Approve</Button>
              <Button variant="destructive" onClick={() => remove(s.id)}>Remove</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PartnerManager({ data, onChange }: { data: PartnerResource[]; onChange: () => void }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("pdf");
  async function add() {
    await apiRequest('POST', '/api/admin/partner-resources', { title, url, type });
    setTitle(""); setUrl(""); setType("pdf"); onChange();
  }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        <select className="border rounded px-2" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="pdf">PDF</option>
          <option value="video">Video</option>
          <option value="link">Link</option>
        </select>
        <Button onClick={add}>Add</Button>
      </div>
      <div className="space-y-2">
        {data.map(p => (
          <div key={p.id} className="border rounded p-3 flex justify-between items-center">
            <div className="font-medium">{p.title}</div>
            <div className="text-xs text-gray-500">{p.type}</div>
            <a className="text-primary underline" href={p.url} target="_blank">Open</a>
          </div>
        ))}
      </div>
    </div>
  );
}


