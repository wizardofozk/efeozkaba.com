'use client'
import { useState } from 'react'

type Country = {
  iso: string
  name: string
  flag: string
  slug?: string
  status: 'guide' | 'visited' | 'planned'
  region: string
}

const COUNTRIES: Country[] = [
  { iso: 'JP', name: 'Japan', flag: '🇯🇵', slug: 'japan', status: 'guide', region: 'Asia' },
  { iso: 'TR', name: 'Turkey', flag: '🇹🇷', status: 'visited', region: 'Europe/Asia' },
  { iso: 'MY', name: 'Malaysia', flag: '🇲🇾', status: 'visited', region: 'Asia' },
  { iso: 'TH', name: 'Thailand', flag: '🇹🇭', status: 'visited', region: 'Asia' },
  { iso: 'SG', name: 'Singapore', flag: '🇸🇬', status: 'visited', region: 'Asia' },
  { iso: 'GB', name: 'United Kingdom', flag: '🇬🇧', status: 'visited', region: 'Europe' },
  { iso: 'DE', name: 'Germany', flag: '🇩🇪', status: 'visited', region: 'Europe' },
  { iso: 'FR', name: 'France', flag: '🇫🇷', status: 'visited', region: 'Europe' },
  { iso: 'IT', name: 'Italy', flag: '🇮🇹', status: 'visited', region: 'Europe' },
  { iso: 'ES', name: 'Spain', flag: '🇪🇸', status: 'visited', region: 'Europe' },
  { iso: 'NL', name: 'Netherlands', flag: '🇳🇱', status: 'visited', region: 'Europe' },
  { iso: 'GR', name: 'Greece', flag: '🇬🇷', status: 'visited', region: 'Europe' },
  { iso: 'PT', name: 'Portugal', flag: '🇵🇹', status: 'visited', region: 'Europe' },
  { iso: 'HR', name: 'Croatia', flag: '🇭🇷', status: 'visited', region: 'Europe' },
  { iso: 'CZ', name: 'Czech Republic', flag: '🇨🇿', status: 'visited', region: 'Europe' },
  { iso: 'AT', name: 'Austria', flag: '🇦🇹', status: 'visited', region: 'Europe' },
  { iso: 'US', name: 'United States', flag: '🇺🇸', status: 'visited', region: 'Americas' },
  { iso: 'AE', name: 'UAE', flag: '🇦🇪', status: 'visited', region: 'Middle East' },
]

const FILTERS = ['All', 'Has Guide', 'Visited'] as const
type Filter = typeof FILTERS[number]

export default function Destinations() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('All')

  const filtered = COUNTRIES.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'All' ? true :
      filter === 'Has Guide' ? c.status === 'guide' :
      filter === 'Visited' ? c.status !== 'planned' : true
    return matchSearch && matchFilter
  })

  return (
    <div>
      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-sm">⌕</span>
          <input
            type="text"
            placeholder="Search country..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-lg pl-8 pr-4 py-2.5 text-stone-700 text-sm placeholder-stone-300 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs tracking-wider uppercase transition-all duration-200 ${
                filter === f
                  ? 'bg-amber-100 border border-amber-400 text-amber-600'
                  : 'border border-stone-200 text-stone-400 hover:border-stone-300 hover:text-stone-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Country grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {filtered.map(country => {
          const hasGuide = country.status === 'guide'
          const card = (
            <div
              key={country.iso}
              className={`group relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 ${
                hasGuide
                  ? 'border-amber-200 hover:border-amber-400 hover:bg-amber-50 cursor-pointer bg-white'
                  : 'border-stone-100 opacity-40 cursor-default bg-white'
              }`}
            >
              <span className="text-3xl">{country.flag}</span>
              <span className={`text-xs text-center leading-tight ${hasGuide ? 'text-stone-600 group-hover:text-stone-900' : 'text-stone-400'} transition-colors`}>
                {country.name}
              </span>
              {hasGuide && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
              {!hasGuide && (
                <span className="text-stone-300 text-[9px] tracking-wider uppercase">Soon</span>
              )}
            </div>
          )

          return hasGuide ? (
            <a key={country.iso} href={`/travel/${country.slug}`}>{card}</a>
          ) : (
            <div key={country.iso}>{card}</div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-stone-300 text-sm mt-8">No countries found for "{search}"</p>
      )}

      {/* Count */}
      <p className="text-stone-300 text-xs mt-6">
        {COUNTRIES.filter(c => c.status === 'guide').length} guides written · {COUNTRIES.filter(c => c.status !== 'planned').length} countries visited
      </p>
    </div>
  )
}
