'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

const FILTERS = {
  deployment: ['saas', 'api', 'selfhost', 'private'],
  pricing: ['free', 'freemium', 'token', 'subscription', 'lifetime'],
  platform: ['web', 'app', 'desktop', 'vscode', 'api', 'sdk'],
  os: ['windows', 'android', 'ios', 'linux', 'arm'],
}

export default function ToolsFilters({ locale }) {
  const t = useTranslations('tools')
  const router = useRouter()
  const sp = useSearchParams()

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(sp.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/${locale}/tools?${params.toString()}`)
  }

  const dims = [
    { key: 'deploy', label: 'filterDeployment', prefix: 'deploy', options: FILTERS.deployment },
    { key: 'price', label: 'filterPricing', prefix: 'price', options: FILTERS.pricing },
    { key: 'platform', label: 'filterPlatform', prefix: 'platform', options: FILTERS.platform },
    { key: 'os', label: 'filterOS', prefix: 'os', options: FILTERS.os },
  ]

  return (
    <div className="flex flex-col gap-2.5">
      {dims.map(dim => (
        <div key={dim.key}>
          <label className="text-[11px] text-tertiary mb-1 block">{t(dim.label)}</label>
          <select
            value={sp.get(dim.key) || ''}
            onChange={e => updateFilter(dim.key, e.target.value)}
            className="w-full px-3 py-2 rounded-md text-[12.5px] bg-surface border border-app text-primary focus:outline-none focus:border-app-strong cursor-pointer transition-colors"
          >
            <option value="">{t('all')}</option>
            {dim.options.map(f => (
              <option key={f} value={f}>{t(`${dim.prefix}_${f}`)}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )
}
