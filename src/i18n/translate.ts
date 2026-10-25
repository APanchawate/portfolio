import en from './en'
import de from './de'
import type { TranslationKey } from './en'
import type { Language } from './LanguageContext'
const normalize = (text: string) => text.replace(/\s+/g, ' ').trim()
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const exact = new Map<string, string>()
const patterns: { regex: RegExp; translation: string; source: string }[] = []
for (const key of Object.keys(en) as TranslationKey[]) {
  const source = en[key], translation = de[key] || source
  if (source.includes('{{')) {
    const pieces = source.split(/(\{\{\d+\}\})/g)
    patterns.push({ source, regex: new RegExp('^' + pieces.map(piece => /^\{\{\d+\}\}$/.test(piece) ? '(.+?)' : escape(piece)).join('') + '$'), translation })
  } else exact.set(normalize(source), translation)
}
// Prefer specific sentence patterns before short labels.
patterns.sort((a,b) => b.regex.source.length-a.regex.source.length)
const terms = [...exact.keys()].filter(text => /[A-Za-z]/.test(text)).sort((a,b)=>b.length-a.length)
const fragments = new RegExp(`(^|[^\\p{L}\\p{N}])(${terms.map(escape).join('|')})(?=$|[^\\p{L}\\p{N}])`, 'gu')
export function translateMessage(raw: string, language: Language, depth = 0): string {
  if (language === 'en' || !raw || depth > 5) return raw
  const source = normalize(raw)
  if (/^(?:(?:SIM|SYN|DEMO|EVID)-[A-Za-z0-9-]+|F\d+)$/.test(source)) return raw
  let translated = exact.get(source)
  if (translated === undefined) {
    for (const pattern of patterns) {
      const match=pattern.regex.exec(source)
      if(match && pattern.source === '{{0}}: {{1}} of {{2}}' && (!/^\d+$/.test(match[2]) || !/^\d+$/.test(match[3]))) continue
      if(match){translated=pattern.translation.replace(/\{\{(\d+)\}\}/g,(_,index)=>translateMessage(match[Number(index)+1],language,depth+1));break}
    }
  }
  if (translated === undefined) {
    // Composed labels retain the same values while their known constituent phrases translate.
    translated = source.replace(fragments,(_match,boundary,term)=>boundary+(exact.get(term)??term))
  }
  if (/^-?\d+(?:,\d{3})*(?:\.\d+)?[%+]?$/.test(source)) {
    const suffix=source.endsWith('%')?'%':source.endsWith('+')?'+':'',value=Number(source.replaceAll(',','').replace(/[%+]$/,''))
    translated=new Intl.NumberFormat('de-DE',{maximumFractionDigits:10}).format(value)+suffix
  }
  translated=translated.replace(/\b(\d{1,2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g,(_,day,month)=>`${day}. ${({Jan:'Jan.',Feb:'Feb.',Mar:'März',Apr:'Apr.',May:'Mai',Jun:'Juni',Jul:'Juli',Aug:'Aug.',Sep:'Sept.',Oct:'Okt.',Nov:'Nov.',Dec:'Dez.'} as Record<string,string>)[month]}`)
  translated=translated.replace(/\b(\d{1,2}) (Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)\b/g,'$1. $2')
  return (raw.match(/^\s*/)?.[0]??'')+translated+(raw.match(/\s*$/)?.[0]??'')
}
export function t(key: TranslationKey, language: Language): string { return language==='de' ? de[key] || en[key] : en[key] }
