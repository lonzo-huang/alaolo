'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Star } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function FavoriteButton({ resourceId, locale }) {
  const t = useTranslations('detail')
  const router = useRouter()
  const [isFav, setIsFav] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const sb = createSupabaseBrowser()
    sb.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (data.user) {
        const { data: fav } = await sb.from('favorites').select('resource_id').eq('user_id', data.user.id).eq('resource_id', resourceId).maybeSingle()
        setIsFav(!!fav)
      }
    })
  }, [resourceId])

  const toggle = async () => {
    if (!user) {
      toast.info(t('loginToFavorite'))
      router.push(`/${locale}/login`)
      return
    }
    setLoading(true)
    const sb = createSupabaseBrowser()
    if (isFav) {
      await sb.from('favorites').delete().eq('user_id', user.id).eq('resource_id', resourceId)
      setIsFav(false)
    } else {
      await sb.from('favorites').insert({ user_id: user.id, resource_id: resourceId })
      setIsFav(true)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-sm font-medium transition-all ${isFav ? 'bg-[#F5C518]/10 border-[#F5C518]/40 text-[#F5C518]' : 'bg-surface-hover border-app text-primary hover:bg-surface'}`}
    >
      <Star className={`w-4 h-4 ${isFav ? 'fill-[#F5C518]' : ''}`} />
      {isFav ? t('unfavorite') : t('favorite')}
    </button>
  )
}
